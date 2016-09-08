package cf.funge.aworldofplants.test;

import cf.funge.aworldofplants.RequestRouter;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.CreatePlantRequest;
import cf.funge.aworldofplants.model.action.CreatePlantResponse;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import static org.junit.Assert.assertEquals;

/**
 * Created by Dillon on 2016-09-09.
 */
public class TestThing extends cf.funge.aworldofplants.test.Test{
    @Test
    public void testAddThingAction() {
        RequestRouter requestRouter = new RequestRouter();

        String request =
                "{" +
                    "action:'cf.funge.aworldofplants.action.AddThingAction'," +
                    "body: {" +
                        "thingName: 'testThing'," +
                        "username': 'dill'," +
                        "plantId: 'test-plant-id'," +
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
    public void testAddThingRequest() {

    }

    @Test
    public void testAddThingResponse() {

    }
}
