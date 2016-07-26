package cf.funge.aworldofplants.model.action;

/**
 * Bean for the update plant by id request.
 */
public class UpdatePlantRequest {
    private String plantId;
    private String username;
    private String plantType;
    private String plantName;
    private int plantAge;

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPlantType() {
        return plantType;
    }

    public void setPlantType(String plantType) {
        this.plantType = plantType;
    }

    public String getPlantName() {
        return plantName;
    }

    public void setPlantName(String plantName) {
        this.plantName = plantName;
    }

    public int getPlantAge() {
        return plantAge;
    }

    public void setPlantAge(int plantAge) {
        this.plantAge = plantAge;
    }
}
