package cf.funge.aworldofplants.model.timeline;

import cf.funge.aworldofplants.configuration.DynamoDBConfiguration;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAutoGeneratedKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

/**
 * The TimelineEvent object. This bean also contains the annotations required for the DynamoDB object mapper to work
 */
@DynamoDBTable(tableName = DynamoDBConfiguration.TIMELINE_TABLE_NAME)
public class TimelineEvent {
    private String timelineEventId;
    private String username;
    private String message;
    private String category;
    private int timestamp;
    private int pointValue;

    @DynamoDBAutoGeneratedKey
    @DynamoDBHashKey(attributeName = "timelineEventId")
    public String getTimelineEventId() {
        return timelineEventId;
    }

    public void setTimelineEventId(String timelineEventId) {
        this.timelineEventId = timelineEventId;
    }

    @DynamoDBAttribute(attributeName = "username")
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @DynamoDBAttribute(attributeName = "message")
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @DynamoDBAttribute(attributeName = "category")
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @DynamoDBAttribute(attributeName = "timestamp")
    public int getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(int timestamp) {
        this.timestamp = timestamp;
    }

    @DynamoDBAttribute(attributeName = "pointValue")
    public int getPointValue() {
        return pointValue;
    }

    public void setPointValue(int pointValue) {
        this.pointValue = pointValue;
    }
}

