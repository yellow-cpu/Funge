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
import cf.funge.aworldofplants.model.action.LoginUserRequest;
import cf.funge.aworldofplants.model.action.LoginUserResponse;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserCredentials;
import cf.funge.aworldofplants.model.user.UserDAO;

import cf.funge.aworldofplants.model.user.UserIdentity;
import cf.funge.aworldofplants.provider.CredentialsProvider;
import cf.funge.aworldofplants.provider.ProviderFactory;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

/**
 * Action used to verify a user credentials and return a set of temporary AWS credentials
 * <p/>
 * POST to /login/
 */
public class LoginAction extends AbstractAction {
    private LambdaLogger logger;
    private CredentialsProvider cognito = ProviderFactory.getCredentialsProvider();

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        LoginUserRequest input = getGson().fromJson(request, LoginUserRequest.class);

        if (input == null ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("") ||
                input.getPassword() == null ||
                input.getPassword().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        UserDAO dao = DAOFactory.getUserDAO();
        User loggedUser;
        try {
            loggedUser = dao.getUserByName(input.getUsername());
        } catch (final DAOException e) {
            logger.log("Error while loading user\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        if (loggedUser == null) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        try {
            if (!PasswordHelper.authenticate(input.getPassword(), loggedUser.getPasswordBytes(), loggedUser.getSaltBytes())) {
                throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
            }
        } catch (final NoSuchAlgorithmException e) {
            logger.log("No algrithm found for password encryption\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_PWD_SALT);
        } catch (final InvalidKeySpecException e) {
            logger.log("No KeySpec found for password encryption\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_PWD_ENCRYPT);
        }

        UserIdentity identity;
        UserCredentials credentials;
        try {
            identity = cognito.getUserIdentity(loggedUser);
            loggedUser.setIdentity(identity);
            credentials = cognito.getUserCredentials(loggedUser);
        } catch (final AuthorizationException e) {
            logger.log("Error while getting oidc token through Cognito\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_NO_COGNITO_IDENTITY);
        }

        // if we reach this point we assume that the user is authenticated.
        LoginUserResponse output = new LoginUserResponse();
        output.setIdentityId(loggedUser.getCognitoIdentityId());
        output.setToken(identity.getOpenIdToken());
        output.setCredentials(credentials);
        output.setUsername(input.getUsername());

        return getGson().toJson(output);
    }
}
