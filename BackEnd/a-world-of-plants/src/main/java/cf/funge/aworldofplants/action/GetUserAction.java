package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetUserRequest;
import cf.funge.aworldofplants.model.action.GetUserResponse;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

public class GetUserAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetUserRequest input = getGson().fromJson(request, GetUserRequest.class);

        if (input == null ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        UserDAO dao = DAOFactory.getUserDAO();
        User user;
        try {
            user = dao.getUserByName(input.getUsername());
        } catch (final DAOException e) {
            logger.log("Error while fetching user with username " + input.getUsername() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        if (!lambdaContext.getIdentity().getIdentityId().equals(user.getIdentity().getIdentityId())) {
            throw new BadRequestException(ExceptionMessages.EX_UNAUTHORIZED_ERROR);
        }

        GetUserResponse output = new GetUserResponse();
        output.setUsername(user.getUsername());
        output.setEmail(user.getEmail() + " travis test");

        return getGson().toJson(output);
    }
}
