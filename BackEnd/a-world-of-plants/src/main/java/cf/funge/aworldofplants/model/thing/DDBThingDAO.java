package cf.funge.aworldofplants.model.thing;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.exception.DAOException;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DDBThingDAO implements ThingDAO {
    private static DDBThingDAO instance = null;

    // credentials for the client come from the environment variables pre-configured by Lambda. These are tied to the
    // Lambda function execution role.
    private static AmazonDynamoDBClient ddbClient = new AmazonDynamoDBClient();

    protected DDBThingDAO() {
        // constructor is protected so that it can't be called from the outside
    }

    public static DDBThingDAO getInstance() {
        if (instance == null) {
            instance = new DDBThingDAO();
        }

        return instance;
    }

    public String createThing(Thing thing) throws DAOException {
        if (thing.getThingName() == null || thing.getThingName().trim().equals("")) {
            throw new DAOException("Cannot create an empty thing");
        }

        getMapper().save(thing);

        return thing.getThingName();
    }

    public Thing getThingByName (String thingName) throws DAOException {
        if (thingName == null || thingName.trim().equals("")) {
            throw new DAOException("Cannot lookup null or empty thingName");
        }

        return getMapper().load(Thing.class, thingName);
    }

    public List<Thing> getThings(int limit) {
        if (limit <= 0 || limit > DynamoDBConfiguration.SCAN_LIMIT)
            limit = DynamoDBConfiguration.SCAN_LIMIT;

        DynamoDBScanExpression expression = new DynamoDBScanExpression();
        expression.setLimit(limit);
        return getMapper().scan(Thing.class, expression);
    }

    public List<Thing> getUserThings(int limit, String username) {
        if (limit <= 0 || limit > DynamoDBConfiguration.SCAN_LIMIT)
            limit = DynamoDBConfiguration.SCAN_LIMIT;

        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":val1", new AttributeValue().withS(username));

        DynamoDBScanExpression expression = new DynamoDBScanExpression()
                .withFilterExpression("username = :val1")
                .withExpressionAttributeValues(eav);
        expression.setLimit(limit);

        List<Thing> scanResult = getMapper().scan(Thing.class, expression);

        return scanResult;
    }

    public String updateThing(Thing thing) {
        getMapper().save(thing);

        return "Thing updated successfully";
    }

    public String deleteThing(String thingName) {
        try {
            getMapper().delete(getThingByName(thingName));
        } catch (DAOException e) {

        }

        return "Thing deleted successfully";
    }

    protected DynamoDBMapper getMapper() {
        return new DynamoDBMapper(ddbClient, new DynamoDBMapperConfig(DynamoDBMapperConfig.SaveBehavior.UPDATE));
    }
}
