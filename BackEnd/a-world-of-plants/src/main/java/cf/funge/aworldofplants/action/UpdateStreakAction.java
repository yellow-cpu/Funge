package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.UpdateStreakRequest;
import cf.funge.aworldofplants.model.action.UpdateStreakResponse;
import cf.funge.aworldofplants.model.timeline.TimelineDAO;
import cf.funge.aworldofplants.model.timeline.TimelineEvent;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Bean for the thing update response.
 */
public class UpdateStreakAction extends AbstractAction
{
    private LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException
    {
        logger = lambdaContext.getLogger();
        TimelineDAO timelineDAO = DAOFactory.getTimelineDAO();

        UpdateStreakRequest input = getGson().fromJson(request, UpdateStreakRequest.class);

        if (input == null ||
                input.getUsername() == null) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        int points = 25;
        int streak = input.getStreak();
        if(streak > 10)
            points = 40;
        else if(streak > 5)
            points = 30;

        TimelineEvent timelineEvent = new TimelineEvent();
        timelineEvent.setUsername(input.getUsername());
        timelineEvent.setTitle("Login Streak");
        timelineEvent.setMessage("You are on a " + streak + " day streak! Log in tomorrow to continue your streak!");
        timelineEvent.setCategory("streak");
        timelineEvent.setTimestamp(input.getTimestamp());
        timelineEvent.setPointValue(points);

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

        UpdateStreakResponse output = new UpdateStreakResponse();
        output.setTimelineEvent(timelineEvent);

        return getGson().toJson(output);
    }
}
