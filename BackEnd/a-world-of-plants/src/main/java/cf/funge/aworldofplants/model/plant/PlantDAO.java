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

import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.model.action.GetPlantHistoryResponse;
import cf.funge.aworldofplants.model.action.UpdatePlantRequest;

import java.util.List;

/**
 * This interface defines the methods required for an implementation of the PlantDAO object
 */
public interface PlantDAO {
    /**
     * Creates a new plant in the data store
     *
     * @param plant The plant object to be created
     * @return The generated plantId
     * @throws DAOException Whenever an error occurs while accessing the data store
     */
    String createPlant(Plant plant) throws DAOException;

    /**
     * Retrieves a Plant object by its id
     *
     * @param plantId The plantId to look for
     * @return An initialized and populated Plant object. If the plant couldn't be found return null
     * @throws DAOException Whenever a data store access error occurs
     */
    Plant getPlantById(String plantId) throws DAOException;

    List<Plant> getPlants(int limit);

    List<Plant> getUserPlants(int limit, String username);

    String updatePlant(Plant plant);

    String deletePlant(String plantId);

    GetPlantHistoryResponse getPlantHistory(String plantId, String startDate, String endDate, String type);
}
