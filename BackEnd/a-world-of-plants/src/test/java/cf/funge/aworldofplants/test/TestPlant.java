package cf.funge.aworldofplants.test;

import cf.funge.aworldofplants.RequestRouter;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.CreatePlantRequest;
import cf.funge.aworldofplants.model.action.CreatePlantResponse;
import com.amazonaws.services.iot.model.CreatePolicyResult;
import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import org.junit.Test;
import org.springframework.context.annotation.Bean;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import static org.junit.Assert.assertEquals;

/**
 * Created by Dillon on 2016-09-09.
 */
public class TestPlant extends cf.funge.aworldofplants.test.Test {
    @Test
    public void testCreatePlantAction() {
        RequestRouter requestRouter = new RequestRouter();

        String request =
                "{" +
                    "action:'cf.funge.aworldofplants.action.CreatePlantAction'," +
                    "body: {" +
                        "username: 'dill'," +
                        "plantType': 'Spinach'," +
                        "plantName: 'Spinny'," +
                        "plantAge: '09/09/2016'," +
                        "colour: '#FFFFFF'" +
                    "}" +
                "}";

        InputStream inputStream = new ByteArrayInputStream(request.getBytes());

        try {
            requestRouter.lambdaHandler(inputStream, new ByteArrayOutputStream(), mockContext());
        } catch (InternalErrorException e) {

        } catch (BadRequestException e) {

        }
    }

    @Test
    public void testCreatePlantRequest() {
        String username = "dill";
        String plantType = "Spinach";
        String plantName = "Spinny";
        String plantAge = "09/09/2016";
        String colour = "#FFFFFF";

        CreatePlantRequest createPlantRequest = new CreatePlantRequest();
        createPlantRequest.setUsername(username);
        createPlantRequest.setPlantType(plantType);
        createPlantRequest.setPlantName(plantName);
        createPlantRequest.setPlantAge(plantAge);
        createPlantRequest.setColour(colour);

        assertEquals(createPlantRequest.getUsername(), username);
        assertEquals(createPlantRequest.getPlantType(), plantType);
        assertEquals(createPlantRequest.getPlantName(), plantName);
        assertEquals(createPlantRequest.getPlantAge(), plantAge);
        assertEquals(createPlantRequest.getColour(), colour);
    }

    @Test
    public void testCreatePlantResponse() {
        String plantId = "test-plant-id";

        CreatePlantResponse createPlantResponse = new CreatePlantResponse();
        createPlantResponse.setPlantId(plantId);

        assertEquals(createPlantResponse.getPlantId(), plantId);
    }
}
