package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.GetPlantHistoryRequest;
import cf.funge.aworldofplants.model.action.GetPlantHistoryResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Created by Dillon on 2016-10-20.
 */
public class GetPlantHistoryAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        GetPlantHistoryRequest input = getGson().fromJson(request, GetPlantHistoryRequest.class);

        System.out.println("GET PLANT HISTORY BEGINNING");
        System.out.println(input.toString());

        if (input == null ||
                input.getPlantId() == null ||
                input.getPlantId().trim().equals("") ||
                input.getChartType() == null ||
                input.getChartType().trim().equals("") ||
                input.getStartDate() == null ||
                input.getStartDate().trim().equals("") ||
                input.getEndDate() == null ||
                input.getEndDate().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        GetPlantHistoryResponse output = new GetPlantHistoryResponse();
        output.setStartTimes(new String[]{"1470096000000", "1470096000000", "1470096000000", "1470096000000"});
        output.setEndTimes(new String[]{"1470096000000", "1470096000000", "1470096000000", "1470096000000"});
        output.setAverages(new String[]{"10", "20", "10", "30"});
        output.setMins(new String[]{"1", "3", "4", "2"});
        output.setMaxes(new String[]{"15", "23", "18", "35"});

        System.out.println("GET PLANT HISTORY DONE");
        System.out.println(output.toString());

        return getGson().toJson(output);
    }
}
