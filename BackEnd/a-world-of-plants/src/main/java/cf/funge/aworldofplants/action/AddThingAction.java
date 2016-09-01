package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.AddThingRequest;
import cf.funge.aworldofplants.model.action.AddThingResponse;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateResult;
import com.amazonaws.services.iot.model.CreateThingRequest;
import com.amazonaws.services.iot.model.CreateThingResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.iot.*;
import com.google.gson.JsonObject;

/**
 * Created by Dillon on 2016-09-01.
 */
public class AddThingAction extends AbstractAction {
    private LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        AddThingRequest input = getGson().fromJson(request, AddThingRequest.class);

        if (input == null ||
                input.getThingName() == null ||
                input.getThingName().trim().equals("") ||
                input.getPlantId() == null ||
                input.getPlantId().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        AWSIotClient awsIotClient = new AWSIotClient();

        // Create thing
        CreateThingRequest createThingRequest = new CreateThingRequest();
        createThingRequest.setThingName(input.getThingName());
        CreateThingResult createThingResult = awsIotClient.createThing(createThingRequest);

        // Create keys and certificate
        CreateKeysAndCertificateRequest createKeysAndCertificateRequest = new CreateKeysAndCertificateRequest();
        createKeysAndCertificateRequest.setSetAsActive(true);
        CreateKeysAndCertificateResult createKeysAndCertificateResult =  awsIotClient.createKeysAndCertificate(createKeysAndCertificateRequest);

        System.out.println(createKeysAndCertificateResult.getCertificatePem());
        System.out.println(createKeysAndCertificateResult.getKeyPair());

        AddThingResponse output = new AddThingResponse();
        output.setThingArn(createThingResult.getThingArn());

        return getGson().toJson(output);
    }
}
