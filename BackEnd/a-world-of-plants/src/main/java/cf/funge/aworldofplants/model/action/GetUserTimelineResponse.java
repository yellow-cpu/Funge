package cf.funge.aworldofplants.model.action;

import cf.funge.aworldofplants.model.timeline.TimelineEvent;

import java.util.List;

/**
 * Created by GP on 07/09/2016.
 */
public class GetUserTimelineResponse {
    private int count;
    private int pageLimit;
    private List<TimelineEvent> timelineEvents;

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

    public List<TimelineEvent> getTimelineEvents() {
        return timelineEvents;
    }

    public void setTimelineEvents(List<TimelineEvent> timelineEvents) {
        this.timelineEvents = timelineEvents;
    }
}
