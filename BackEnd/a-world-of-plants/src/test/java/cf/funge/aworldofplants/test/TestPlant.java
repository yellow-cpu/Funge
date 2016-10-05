package cf.funge.aworldofplants.test;

import cf.funge.aworldofplants.RequestRouter;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.CreatePlantRequest;
import cf.funge.aworldofplants.model.action.CreatePlantResponse;
import cf.funge.aworldofplants.model.plant.DDBPlantDAO;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
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
        Plant plant = new Plant();
        String plantId = "test-plant-id";

        plant.setPlantId(plantId);

        CreatePlantResponse createPlantResponse = new CreatePlantResponse();
        createPlantResponse.setPlant(plant);

        assertEquals(createPlantResponse.getPlant().getPlantId(), plantId);
    }

    @Test
    public void testDDBPlantDAOCreatePlant() {
        Plant plant = new Plant();
        String result = "";

        try {
            result = mockPlantDAO().createPlant(plant);
        } catch (DAOException e) {

        }

        assertEquals(result, "test-plant-id");
    }

    @Test
    public void testDDBPlantDAOGetUserPlants() {
        List<Plant> result = new ArrayList<>();

        result = mockPlantDAO().getUserPlants(50, "dill");

        assertEquals(result.size(), 1);
    }
}
