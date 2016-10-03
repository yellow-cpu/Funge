package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.ChangeThingRequest;
import cf.funge.aworldofplants.model.action.ChangeThingResponse;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Action that updates a thing
 * <p/>
 * POST to /things/update
 */
public class ChangeThingAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        ChangeThingRequest input = getGson().fromJson(request, ChangeThingRequest.class);

        if (input == null ||
                input.getThingId() == null ||
                input.getPlantId() == null ||
                input.getThingId().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        ThingDAO dao = DAOFactory.getThingDAO();
        Thing updatedThing = new Thing();
        updatedThing.setThingId(input.getThingId());
        updatedThing.setThingName(input.getThingName());
        updatedThing.setUsername(input.getUsername());
        updatedThing.setPlantId(input.getPlantId());
        updatedThing.setCertificateId(input.getCertificateId());
        updatedThing.setCertificateArn(input.getCertificateArn());
        updatedThing.setColour(input.getColour());
        updatedThing.setMqttTopic(input.getMqttTopic());
        updatedThing.setPolicyName(input.getPolicyName());
        updatedThing.setFiles(input.getFiles());

        dao.updateThing(updatedThing);
        ChangeThingResponse output = new ChangeThingResponse();
        output.setThingId(input.getThingId());

        return getGson().toJson(output);
    }
}
