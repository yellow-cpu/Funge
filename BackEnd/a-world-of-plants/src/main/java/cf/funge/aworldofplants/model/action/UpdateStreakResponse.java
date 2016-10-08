package cf.funge.aworldofplants.model.action;

import cf.funge.aworldofplants.model.timeline.TimelineEvent;

/**
 * Bean for the update streak response.
 */
public class UpdateStreakResponse
{
    private TimelineEvent event;

    public TimelineEvent getTimelineEvent() {
        return event;
    }

    public void setTimelineEvent(TimelineEvent event) {
        this.event = event;
    }
}
