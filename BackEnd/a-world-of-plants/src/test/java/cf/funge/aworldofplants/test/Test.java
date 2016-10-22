package cf.funge.aworldofplants.test;

import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.model.action.GetPlantHistoryRequest;
import cf.funge.aworldofplants.model.action.GetPlantHistoryResponse;
import cf.funge.aworldofplants.model.plant.DDBPlantDAO;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dillon on 2016-09-09.
 */
public class Test {
    @Bean
    Context mockContext() {
        return new Context() {
            @Override
            public String getAwsRequestId() {
                return null;
            }

            @Override
            public String getLogGroupName() {
                return null;
            }

            @Override
            public String getLogStreamName() {
                return null;
            }

            @Override
            public String getFunctionName() {
                return null;
            }

            @Override
            public String getFunctionVersion() {
                return null;
            }

            @Override
            public String getInvokedFunctionArn() {
                return null;
            }

            @Override
            public CognitoIdentity getIdentity() {
                return null;
            }

            @Override
            public ClientContext getClientContext() {
                return null;
            }

            @Override
            public int getRemainingTimeInMillis() {
                return 0;
            }

            @Override
            public int getMemoryLimitInMB() {
                return 0;
            }

            @Override
            public LambdaLogger getLogger() {
                return null;
            }
        };
    }

    @Bean
    PlantDAO mockPlantDAO() {
        return new PlantDAO() {
            @Override
            public String createPlant(Plant plant) throws DAOException {
                return "test-plant-id";
            }

            @Override
            public Plant getPlantById(String plantId) throws DAOException {
                return null;
            }

            @Override
            public List<Plant> getPlants(int limit) {
                return null;
            }

            @Override
            public List<Plant> getUserPlants(int limit, String username) {
                List<Plant> plants = new ArrayList<>();
                plants.add(new Plant());
                return plants;
            }

            @Override
            public String updatePlant(Plant plant) {
                return null;
            }

            @Override
            public String deletePlant(String plantId) {
                return null;
            }

            @Override
            public GetPlantHistoryResponse getPlantHistory(String plantId, String startDate, String endDate) {
                return null;
            }
        };
    }

    @Bean
    ThingDAO mockThingDAO() {
        return new ThingDAO() {
            @Override
            public String createThing(Thing thing) throws DAOException {
                return "test-thing-arn";
            }

            @Override
            public Thing getThingByName(String thingName) throws DAOException {
                return null;
            }

            @Override
            public Thing getThingByPlantId(String plantId) throws DAOException {
                return null;
            }

            @Override
            public List<Thing> getThings(int limit) {
                return null;
            }

            @Override
            public List<Thing> getUserThings(int limit, String username) {
                List<Thing> things = new ArrayList<>();
                things.add(new Thing());
                return things;
            }

            @Override
            public String updateThing(Thing thing) {
                return null;
            }

            @Override
            public String deleteThing(String thing) {
                return null;
            }
        };
    }
}
