package cf.funge.aworldofplants.model.timeline;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import cf.funge.aworldofplants.exception.DAOException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DDBTimelineDAO implements TimelineDAO {
    private static DDBTimelineDAO instance = null;

    // Credentials for the client come from the environment variables pre-configured by Lambda. These are tied to the
    // Lambda function execution role.
    private static AmazonDynamoDBClient ddbClient = new AmazonDynamoDBClient();

    protected DDBTimelineDAO() {
        // constructor is protected so that it can't be called from the outside
    }

    /**
     * Returns the initialized default instance of the TimelineDAO
     *
     * @return An initialized TimelineDAO instance
     */
    public static DDBTimelineDAO getInstance() {
        if (instance == null) {
            instance = new DDBTimelineDAO();
        }

        return instance;
    }

    /**
     * Creates a new Timeline Event
     *
     * @param timelineEvent The TimelineEvent object to be created
     * @return The id for the newly created TimelineEvent object
     * @throws DAOException
     */
    public String createTimelineEvent(TimelineEvent timelineEvent) throws DAOException {
        if (timelineEvent.getMessage() == null || timelineEvent.getMessage().trim().equals("")) {
            throw new DAOException("Cannot lookup null or empty timelineEvent");
        }

        getMapper().save(timelineEvent);

        return timelineEvent.getTimelineEventId();
    }

    /**
     * Gets a Plant by its id
     *
     * @param timelineEventId The timelineEventId to look for
     * @return An initialized TimelineEvent object, null if the TimelineEvent could not be found
     * @throws DAOException
     */
    public TimelineEvent getTimelineEventbyId(String timelineEventId) throws DAOException {
        if (timelineEventId == null || timelineEventId.trim().equals("")) {
            throw new DAOException("Cannot lookup null or empty plantId");
        }

        return getMapper().load(TimelineEvent.class, timelineEventId);
    }

    /**
     * Returns a list of timelineEvents for a user in the DynamoDB table.
     *
     * @param limit The maximum numbers of results for the scan
     * @return A List of TimelineEvent objects
     */
    public List<TimelineEvent> getUserTimelineEvents(int limit, String username) {
        if (limit <= 0 || limit > DynamoDBConfiguration.SCAN_LIMIT)
            limit = DynamoDBConfiguration.SCAN_LIMIT;

        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":val1", new AttributeValue().withS(username));

        TimelineEvent timelineEvent = new TimelineEvent();
        timelineEvent.setTimelineEventId("90e0f75b-d64f-4537-9c0a-e6996903f42c");

        DynamoDBQueryExpression<TimelineEvent> expression = new DynamoDBQueryExpression<TimelineEvent>()
                .withFilterExpression("username = :val1")
                .withExpressionAttributeValues(eav);
        expression.setLimit(limit);

        expression.setHashKeyValues(timelineEvent);

        List<TimelineEvent> scanResult = getMapper().query(TimelineEvent.class, expression);

//        Map<String, AttributeValue> eav = new HashMap<>();
//        eav.put(":val1", new AttributeValue().withS(username));

//        DynamoDBScanExpression expression = new DynamoDBScanExpression()
//                .withFilterExpression("username = :val1")
//                .withExpressionAttributeValues(eav);
//        expression.setLimit(limit);
//
//        List<TimelineEvent> scanResult = getMapper().scan(TimelineEvent.class, expression);

        return scanResult;
    }

    public String deleteTimelineEvent(String timelineEventId) {
        try {
            getMapper().delete(getTimelineEventbyId(timelineEventId));
        } catch (DAOException e) {

        }

        return "Timeline event deleted successfully";
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
