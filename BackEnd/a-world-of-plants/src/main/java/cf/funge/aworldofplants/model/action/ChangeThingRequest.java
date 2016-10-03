package cf.funge.aworldofplants.model.action;

/**
 * Bean for the update thing by thing name request.
 */
public class ChangeThingRequest {
    private String plantId;
    private String colour;
    private String thingName;

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public String getThingName() {
        return thingName;
    }

    public void setThingName(String thingName) {
        this.thingName = thingName;
    }
}
