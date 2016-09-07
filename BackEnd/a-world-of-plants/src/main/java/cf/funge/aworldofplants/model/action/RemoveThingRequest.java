package cf.funge.aworldofplants.model.action;

/**
 * Created by Dillon on 2016-09-07.
 */
public class RemoveThingRequest {
    private String thingId;
    private String thingName;

    public String getThingId() {
        return thingId;
    }

    public void setThingId(String thingId) {
        this.thingId = thingId;
    }

    public String getThingName() {
        return thingName;
    }

    public void setThingName(String thingName) {
        this.thingName = thingName;
    }
}
