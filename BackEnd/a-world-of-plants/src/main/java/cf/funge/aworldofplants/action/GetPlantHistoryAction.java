package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.GetPlantHistoryRequest;
import cf.funge.aworldofplants.model.action.GetPlantHistoryResponse;
import cf.funge.aworldofplants.model.plant.PlantDAO;
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
        System.out.println(input.getStartDate() + " " + input.getEndDate());

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

        PlantDAO plantDAO = DAOFactory.getPlantDAO();

        GetPlantHistoryResponse output;

        String chartType = "";

        if (input.getChartType().equals("tempHistory")) {
            chartType = "temperature";
        } else if (input.getChartType().equals("humidityHistory")) {
            chartType = "humidity";
        } else if (input.getChartType().equals("moistureHistory")) {
            chartType = "moisture";
        }

        output = plantDAO.getPlantHistory(input.getPlantId(), input.getStartDate(), input.getEndDate(), chartType);

        return getGson().toJson(output);
    }
}
