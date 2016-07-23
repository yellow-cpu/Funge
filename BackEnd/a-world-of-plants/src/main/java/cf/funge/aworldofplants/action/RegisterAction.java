/*
 * Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 * with the License. A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
 * OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.AuthorizationException;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.helper.PasswordHelper;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.RegisterUserRequest;
import cf.funge.aworldofplants.model.action.RegisterUserResponse;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserDAO;
import cf.funge.aworldofplants.model.user.UserIdentity;
import cf.funge.aworldofplants.provider.CredentialsProvider;
import cf.funge.aworldofplants.provider.ProviderFactory;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.nio.ByteBuffer;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

/**
 * Action used to register a new user.
 * <p/>
 * POST to /users/
 */
public class RegisterAction extends AbstractAction {

    private CredentialsProvider cognito = ProviderFactory.getCredentialsProvider();

    private LambdaLogger logger = null;

    /**
     * Handler implementation for the registration action. It expcts a RegisterUserRequest object in input and returns
     * a serialized RegisterUserResponse object
     *
     * @param request       Receives a JsonObject containing the body content
     * @param lambdaContext The Lambda context passed by the AWS Lambda environment
     * @return Returns the new user identifier and a set of temporary AWS credentials as a RegisterUserResponse object
     * @throws BadRequestException
     * @throws InternalErrorException
     */
    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();
        RegisterUserRequest input = getGson().fromJson(request, RegisterUserRequest.class);

        if (input == null ||
                input.getEmail() == null ||
                input.getEmail().trim().equals("") ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("") ||
                input.getPassword() == null ||
                input.getPassword().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        User newUser = new User();
        newUser.setEmail(input.getEmail());
        newUser.setUsername(input.getUsername());

        // encrypt password
        try {
            byte[] salt = PasswordHelper.generateSalt();
            byte[] encryptedPassword = PasswordHelper.getEncryptedPassword(input.getPassword(), salt);
            newUser.setPassword(ByteBuffer.wrap(encryptedPassword));
            newUser.setSalt(ByteBuffer.wrap(salt));
        } catch (final NoSuchAlgorithmException e) {
            logger.log("No algrithm found for password encryption\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_PWD_SALT);
        } catch (final InvalidKeySpecException e) {
            logger.log("No KeySpec found for password encryption\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_PWD_ENCRYPT);
        }

        if (newUser.getPassword() == null) {
            logger.log("Password null after encryption");
            throw new InternalErrorException(ExceptionMessages.EX_PWD_SAVE);
        }

        UserDAO dao = DAOFactory.getUserDAO();

        UserIdentity identity;
        try {
            // check if the username exists
            if (dao.getUserByName(newUser.getUsername()) != null) {
                throw new BadRequestException("Username is taken");
            }

            if (dao.getUserByEmail(newUser.getEmail())) {
                throw new BadRequestException("Email is taken");
            }

            identity = cognito.getUserIdentity(newUser);

            if (identity == null || identity.getIdentityId() == null || identity.getIdentityId().trim().equals("")) {
                logger.log("Could not load Cognito identity ");
                throw new InternalErrorException(ExceptionMessages.EX_NO_COGNITO_IDENTITY);
            }

            newUser.setIdentity(identity);
            dao.createUser(newUser);
        } catch (final DAOException e) {
            logger.log("Error while saving new user\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        } catch (final AuthorizationException e) {
            logger.log("Error while accessing Cognito\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_NO_COGNITO_IDENTITY);
        }

        RegisterUserResponse output = new RegisterUserResponse();
        output.setIdentityId(newUser.getCognitoIdentityId());
        output.setUsername(newUser.getUsername());
        output.setToken(identity.getOpenIdToken());
        // get credentials
        try {
            output.setCredentials(cognito.getUserCredentials(newUser));
        } catch (final AuthorizationException e) {
            // Credentials are not mandatory as the user can attempt to login again if they are missing,
            // important that we tell them that the user is registered
            logger.log("Error while accessing Cognito\n" + e.getMessage());
        }

        return getGson().toJson(output, RegisterUserResponse.class);
    }
}
