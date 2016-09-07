package cf.funge.aworldofplants.model.thing;

import cf.funge.aworldofplants.exception.DAOException;

import java.util.List;

public interface ThingDAO {
    String createThing(Thing thing) throws DAOException;

    Thing getThingByName(String thingName) throws DAOException;

    Thing getThingByPlantId (String plantId) throws DAOException;

    List<Thing> getThings(int limit);

    List<Thing> getUserThings(int limit, String username);

    String updateThing(Thing thing);

    String deleteThing(String thing);
}
