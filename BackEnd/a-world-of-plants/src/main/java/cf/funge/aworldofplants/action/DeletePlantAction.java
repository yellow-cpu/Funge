package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.CreatePlantRequest;
import cf.funge.aworldofplants.model.action.DeletePlantRequest;
import cf.funge.aworldofplants.model.action.UpdatePlantRequest;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Created by Dillon on 2016-07-26.
 */
public class DeletePlantAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        DeletePlantRequest input = getGson().fromJson(request, DeletePlantRequest.class);

        PlantDAO dao = DAOFactory.getPlantDAO();
        dao.deletePlant(input.getPlantId());

        return "Deleted plant successfully";
    }
}
