package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetPlantThingRequest;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Created by Dillon on 2016-09-07.
 */
public class GetPlantThingAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetPlantThingRequest input = getGson().fromJson(request, GetPlantThingRequest.class);

        if (input == null ||
                input.getPlantId() == null ||
                input.getPlantId().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        ThingDAO dao = DAOFactory.getThingDAO();
        Thing thing;
        try {
            thing = dao.getThingByPlantId(input.getPlantId());
        } catch (final DAOException e) {
            logger.log("Error while fetching plant with id " + input.getPlantId() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        return getGson().toJson(thing);
    }
}
