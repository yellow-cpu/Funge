package cf.funge.aworldofplants.model.action;

import cf.funge.aworldofplants.model.thing.Thing;

import java.util.List;

/**
 * Created by Dillon on 2016-09-05.
 */
public class GetUserThingsResponse {
    private int count;
    private int pageLimit;
    private List<Thing> things;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getPageLimit() {
        return pageLimit;
    }

    public void setPageLimit(int pageLimit) {
        this.pageLimit = pageLimit;
    }

    public List<Thing> getThings() {
        return things;
    }

    public void setPlants(List<Thing> things) {
        this.things = things;
    }
}
