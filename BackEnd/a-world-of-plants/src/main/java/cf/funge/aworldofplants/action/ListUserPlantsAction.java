package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetUserPlantsRequest;
import cf.funge.aworldofplants.model.action.ListPlantsResponse;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.util.List;

/**
 * Action to return a list of plants belonging to a user from the data store
 * <p/>
 * GET to /plants/
 */
public class ListUserPlantsAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetUserPlantsRequest input = getGson().fromJson(request, GetUserPlantsRequest.class);

        System.out.println("Identity ID: " + lambdaContext.getIdentity().getIdentityId());

        if (input == null ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        PlantDAO dao = DAOFactory.getPlantDAO();

        List<Plant> plants = dao.getUserPlants(DynamoDBConfiguration.SCAN_LIMIT, input.getUsername());

        ListPlantsResponse output = new ListPlantsResponse();
        output.setCount(plants.size());
        output.setPageLimit(DynamoDBConfiguration.SCAN_LIMIT);
        output.setPlants(plants);

        return getGson().toJson(output);
    }
}
