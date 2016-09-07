package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.DeletePlantRequest;
import cf.funge.aworldofplants.model.action.DeletePlantResponse;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import cf.funge.aworldofplants.model.timeline.TimelineDAO;
import cf.funge.aworldofplants.model.timeline.TimelineEvent;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

public class DeletePlantAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        DeletePlantRequest input = getGson().fromJson(request, DeletePlantRequest.class);

        PlantDAO dao = DAOFactory.getPlantDAO();
        dao.deletePlant(input.getPlantId());

        TimelineDAO timelineDAO = DAOFactory.getTimelineDAO();

        // Add plant removal timeline event
        try {
            // Get the plant that is being deleted
            Plant plant = dao.getPlantById(input.getPlantId());

            TimelineEvent timelineEvent = new TimelineEvent();
            timelineEvent.setUsername(plant.getUsername());
            timelineEvent.setTitle("Removed a Plant");
            timelineEvent.setMessage("You removed your " + plant.getPlantType() + " called " + plant.getPlantName() + ". " +
                    "We're sad to see it go.");
            timelineEvent.setCategory("plant-delete");
            timelineEvent.setTimestamp((int) (System.currentTimeMillis() / 1000L));
            timelineEvent.setPointValue(25);

            // Store event in database
            String timelineEventId;
            try {
                timelineEventId = timelineDAO.createTimelineEvent(timelineEvent);
            } catch (final DAOException e) {
                logger.log("Error while creating new timeline event\n" + e.getMessage());
                throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
            }

            if (timelineEventId == null || timelineEventId.trim().equals("")) {
                logger.log("TimelineEventId is null or empty");
                throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
            }
        } catch (DAOException e) {
            e.printStackTrace();
        }

        DeletePlantResponse output = new DeletePlantResponse();
        output.setPlantId(input.getPlantId());

        return getGson().toJson(output);
    }
}
