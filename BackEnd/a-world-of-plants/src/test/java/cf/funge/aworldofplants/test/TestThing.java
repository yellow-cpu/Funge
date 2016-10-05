package cf.funge.aworldofplants.test;

import cf.funge.aworldofplants.RequestRouter;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.AddThingRequest;
import cf.funge.aworldofplants.model.action.AddThingResponse;
import cf.funge.aworldofplants.model.thing.Thing;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

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
        String plantId = "test-plant-id";
        String username = "dill";
        String thingName = "testThing";
        String colour = "#FFFFFF";

        AddThingRequest addThingRequest = new AddThingRequest();
        addThingRequest.setPlantId(plantId);
        addThingRequest.setThingName(thingName);
        addThingRequest.setUsername(username);
        addThingRequest.setColour(colour);

        assertEquals(addThingRequest.getPlantId(), plantId);
        assertEquals(addThingRequest.getUsername(),username);
        assertEquals(addThingRequest.getThingName(), thingName);
        assertEquals(addThingRequest.getColour(), colour);
    }

    @Test
    public void testAddThingResponse() {
        String thingName = "test-thing-name";
        Thing thing = new Thing();

        thing.setThingName(thingName);

        AddThingResponse addThingResponse = new AddThingResponse();
        addThingResponse.setThing(thing);

        assertEquals(addThingResponse.getThing().getThingName(), thingName);
    }

    @Test
    public void testDDBPlantDAOCreateThing() {
        Thing thing = new Thing();
        String result = "";

        try {
            result = mockThingDAO().createThing(thing);
        } catch (DAOException e) {

        }

        assertEquals(result, "test-thing-arn");
    }

    @Test
    public void testDDBPlantDAOGetUserThings() {
        List<Thing> result = new ArrayList<>();

        result = mockThingDAO().getUserThings(50, "dill");

        assertEquals(result.size(), 1);
    }
}
