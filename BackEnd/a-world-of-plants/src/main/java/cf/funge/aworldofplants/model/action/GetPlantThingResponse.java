package cf.funge.aworldofplants.model.action;

import cf.funge.aworldofplants.model.thing.Thing;

/**
 * Created by Dillon on 2016-09-07.
 */
public class GetPlantThingResponse {
    private String thingName;
    private String mqttTopic;

    public String getThingName() {
        return thingName;
    }

    public void setThingName(String thingName) {
        this.thingName = thingName;
    }

    public String getMqttTopic() {
        return mqttTopic;
    }

    public void setMqttTopic(String mqttTopic) {
        this.mqttTopic = mqttTopic;
    }
}
