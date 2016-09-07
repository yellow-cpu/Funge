package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetUserTimelineRequest;
import cf.funge.aworldofplants.model.action.GetUserTimelineResponse;
import cf.funge.aworldofplants.model.timeline.TimelineDAO;
import cf.funge.aworldofplants.model.timeline.TimelineEvent;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.util.List;

/**
 * Created by GP on 07/09/2016.
 */
public class ListUserTimelineAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetUserTimelineRequest input = getGson().fromJson(request, GetUserTimelineRequest.class);

        if (input == null ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        TimelineDAO dao = DAOFactory.getTimelineDAO();

        List<TimelineEvent> timelineEvents = dao.getUserTimelineEvents(DynamoDBConfiguration.SCAN_LIMIT, input.getUsername());

        GetUserTimelineResponse output = new GetUserTimelineResponse();
        output.setCount(timelineEvents.size());
        output.setPageLimit(DynamoDBConfiguration.SCAN_LIMIT);
        output.setTimelineEvents(timelineEvents);

        return getGson().toJson(output);
    }
}