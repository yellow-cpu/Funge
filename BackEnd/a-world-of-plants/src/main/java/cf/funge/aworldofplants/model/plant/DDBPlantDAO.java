/*
 * Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 * with the License. A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
 * OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
package cf.funge.aworldofplants.model.plant;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.model.action.GetPlantHistoryRequest;
import cf.funge.aworldofplants.model.action.GetPlantHistoryResponse;
import cf.funge.aworldofplants.model.action.GetPlantThingResponse;
import cf.funge.aworldofplants.model.action.UpdatePlantRequest;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The DynamoDB implementation of the PlantDAO object. This class expects the Plant bean to be annotated with the required
 * DynamoDB Object Mapper annotations. Configuration values for the class such as table name and pagination rows is read
 * from the DynamoDBConfiguration class in the cf.funge.aworldofplants.configuration package. Credentials for the
 * DynamoDB client are read from the environment variables in the Lambda instance.
 * <p/>
 * This class is a singleton and should only be accessed through the static getInstance method. The constructor is defined
 * as protected.
 */
public class DDBPlantDAO implements PlantDAO {
    private static DDBPlantDAO instance = null;

    // credentials for the client come from the environment variables pre-configured by Lambda. These are tied to the
    // Lambda function execution role.
    private static AmazonDynamoDBClient ddbClient = new AmazonDynamoDBClient();

    protected DDBPlantDAO() {
        // constructor is protected so that it can't be called from the outside
    }

    /**
     * Returns the initialized default instance of the PlantDAO
     *
     * @return An initialized PlantDAO instance
     */
    public static DDBPlantDAO getInstance() {
        if (instance == null) {
            instance = new DDBPlantDAO();
        }

        return instance;
    }

    /**
     * Creates a new Plant
     *
     * @param plant The plant object to be created
     * @return The id for the newly created Plant object
     * @throws DAOException
     */
    public String createPlant(Plant plant) throws DAOException {
        if (plant.getPlantType() == null || plant.getPlantType().trim().equals("")) {
            throw new DAOException("Cannot lookup null or empty plant");
        }

        getMapper().save(plant);

        return plant.getPlantId();
    }

    /**
     * Gets a Plant by its id
     *
     * @param plantId The plantId to look for
     * @return An initialized Plant object, null if the Plant could not be found
     * @throws DAOException
     */
    public Plant getPlantById(String plantId) throws DAOException {
        if (plantId == null || plantId.trim().equals("")) {
            throw new DAOException("Cannot lookup null or empty plantId");
        }

        return getMapper().load(Plant.class, plantId);
    }

    /**
     * Returns a list of plants in the DynamoDB table.
     *
     * @param limit The maximum numbers of results for the scan
     * @return A List of Plant objects
     */
    public List<Plant> getPlants(int limit) {
        if (limit <= 0 || limit > DynamoDBConfiguration.SCAN_LIMIT)
            limit = DynamoDBConfiguration.SCAN_LIMIT;

        DynamoDBScanExpression expression = new DynamoDBScanExpression();
        expression.setLimit(limit);
        return getMapper().scan(Plant.class, expression);
    }

    public List<Plant> getUserPlants(int limit, String username) {
        if (limit <= 0 || limit > DynamoDBConfiguration.SCAN_LIMIT)
            limit = DynamoDBConfiguration.SCAN_LIMIT;

        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":val1", new AttributeValue().withS(username));

        DynamoDBScanExpression expression = new DynamoDBScanExpression()
                .withFilterExpression("username = :val1")
                .withExpressionAttributeValues(eav);
        expression.setLimit(limit);

        List<Plant> scanResult = getMapper().scan(Plant.class, expression);

        return scanResult;
    }

    public String updatePlant(Plant plant) {
        getMapper().save(plant);

        return "Plant updated successfully";
    }

    public String deletePlant(String plantId) {
        try {
            getMapper().delete(getPlantById(plantId));
        } catch (DAOException e) {

        }

        return "Plant deleted successfully";
    }

    public GetPlantHistoryResponse getPlantHistory(String plantId, String startDate, String endDate) {
        System.out.println("Find Plant history less than certain date: Scan history.");

        Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
        eav.put(":val1", new AttributeValue().withN(endDate));
        eav.put(":val2", new AttributeValue().withS(plantId));

        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("endTime <= :val1 and plantId = :val2")
                .withExpressionAttributeValues(eav);

        List<PlantHistory> scanResult = getMapper().scan(PlantHistory.class, scanExpression);

        for (PlantHistory plantHistory: scanResult) {
            System.out.println(plantHistory);
        }

        GetPlantHistoryResponse newPlantHistory = null;

        return newPlantHistory;
    }

    /**
     * Returns a DynamoDBMapper object initialized with the default DynamoDB client
     *
     * @return An initialized DynamoDBMapper
     */
    protected DynamoDBMapper getMapper() {
        return new DynamoDBMapper(ddbClient, new DynamoDBMapperConfig(DynamoDBMapperConfig.SaveBehavior.UPDATE));
    }
}
