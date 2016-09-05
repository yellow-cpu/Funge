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
package cf.funge.aworldofplants.model;

import cf.funge.aworldofplants.model.plant.DDBPlantDAO;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import cf.funge.aworldofplants.model.thing.DDBThingDAO;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import cf.funge.aworldofplants.model.user.DDBUserDAO;
import cf.funge.aworldofplants.model.user.UserDAO;

/**
 * The DAO Factory object to abstract the implementation of DAO interfaces.
 */
public class DAOFactory {
    /**
     * Returns the default UserDAO object
     *
     * @return The default implementation of the UserDAO object - by default this is the DynamoDB implementation
     */
    public static UserDAO getUserDAO() {
        return getUserDAO(DAOType.DynamoDB);
    }

    /**
     * Returns a UserDAO implementation
     *
     * @param daoType A value from the DAOType enum
     * @return The corresponding UserDAO implementation
     */
    public static UserDAO getUserDAO(DAOType daoType) {
        UserDAO dao = null;
        switch (daoType) {
            case DynamoDB:
                dao = DDBUserDAO.getInstance();
                break;
        }

        return dao;
    }

    /**
     * Returns the default PlantDAO implementation
     *
     * @return The DynamoDB PlantDAO implementation
     */
    public static PlantDAO getPlantDAO() {
        return getPlantDAO(DAOType.DynamoDB);
    }

    /**
     * Returns a PlantDAO implementation
     *
     * @param daoType The implementation type
     * @return The requested DAO implementation
     */
    public static PlantDAO getPlantDAO(DAOType daoType) {
        PlantDAO dao = null;
        switch (daoType) {
            case DynamoDB:
                dao = DDBPlantDAO.getInstance();
                break;
        }

        return dao;
    }

    public static ThingDAO getThingDAO() {
        return getThingDAO(DAOType.DynamoDB);
    }

    public static ThingDAO getThingDAO(DAOType daoType) {
        ThingDAO dao = null;
        switch (daoType) {
            case DynamoDB:
                dao = DDBThingDAO.getInstance();
                break;
        }

        return dao;
    }

    /**
     * Contains the implementations of the DAO objects. By default we only have a DynamoDB implementation
     */
    public enum DAOType {
        DynamoDB
    }
}
