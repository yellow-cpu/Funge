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
package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.CreatePlantRequest;
import cf.funge.aworldofplants.model.action.CreatePlantResponse;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Action that creates a new Plant in the data store
 * <p/>
 * POST to /plants/
 */
public class CreatePlantAction extends AbstractAction {
    private LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        CreatePlantRequest input = getGson().fromJson(request, CreatePlantRequest.class);

        if (input == null ||
                input.getPlantType() == null ||
                input.getPlantType().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        PlantDAO dao = DAOFactory.getPlantDAO();

        Plant newPlant = new Plant();
        newPlant.setPlantOwner(input.getPlantOwner());
        newPlant.setPlantType(input.getPlantType());
        newPlant.setPlantName(input.getPlantName());
        newPlant.setPlantAge(input.getPlantAge());

        String plantId;

        try {
            plantId = dao.createPlant(newPlant);
        } catch (final DAOException e) {
            logger.log("Error while creating new plant\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        if (plantId == null || plantId.trim().equals("")) {
            logger.log("PlantID is null or empty");
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        CreatePlantResponse output = new CreatePlantResponse();
        output.setPlantId(plantId);

        return getGson().toJson(output);
    }
}
