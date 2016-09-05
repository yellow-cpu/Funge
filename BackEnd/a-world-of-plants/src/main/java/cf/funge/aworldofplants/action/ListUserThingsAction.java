package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetUserThingsRequest;
import cf.funge.aworldofplants.model.action.GetUserThingsResponse;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.util.List;

/**
 * Created by Dillon on 2016-09-05.
 */
public class ListUserThingsAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetUserThingsRequest input = getGson().fromJson(request, GetUserThingsRequest.class);

        if (input == null ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        ThingDAO dao = DAOFactory.getThingDAO();

        List<Thing> things = dao.getUserThings(DynamoDBConfiguration.SCAN_LIMIT, input.getUsername());

        GetUserThingsResponse output = new GetUserThingsResponse();
        output.setCount(things.size());
        output.setPageLimit(DynamoDBConfiguration.SCAN_LIMIT);
        output.setPlants(things);

        return getGson().toJson(output);
    }
}
