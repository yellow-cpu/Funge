package cf.funge.aworldofplants.model.action;

/**
 * Created by Dillon on 2016-09-07.
 */
public class RemoveThingRequest {
    private String thingName;
    private String username;

    public String getThingName() {
        return thingName;
    }

    public void setThingName(String thingName) {
        this.thingName = thingName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
