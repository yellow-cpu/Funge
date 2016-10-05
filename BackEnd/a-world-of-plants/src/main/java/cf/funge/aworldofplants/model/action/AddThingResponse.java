package cf.funge.aworldofplants.model.action;

import cf.funge.aworldofplants.model.thing.Thing;

/**
 * Created by Dillon on 2016-09-01.
 */
public class AddThingResponse {
    private Thing thing;

    public Thing getThing() {
        return thing;
    }

    public void setThing(Thing thing) {
        this.thing = thing;
    }
}
