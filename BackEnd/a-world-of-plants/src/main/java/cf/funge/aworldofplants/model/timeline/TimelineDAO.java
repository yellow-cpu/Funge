package cf.funge.aworldofplants.model.timeline;

import cf.funge.aworldofplants.exception.DAOException;
import java.util.List;

/**
 * This interface defines the methods required for an implementation of the TimelineEvent object
 */
public interface TimelineDAO {
    /**
     * Creates a new Timeline Event
     *
     * @param timelineEvent The TimelineEvent object to be created
     * @return The id for the newly created TimelineEvent object
     * @throws DAOException
     */
    String createTimelineEvent(TimelineEvent timelineEvent) throws DAOException;

    /**
     * Gets a Plant by its id
     *
     * @param timelineEventId The timelineEventId to look for
     * @return An initialized TimelineEvent object, null if the TimelineEvent could not be found
     * @throws DAOException
     */
    TimelineEvent getTimelineEventbyId(String timelineEventId) throws DAOException;

    /**
     * Returns a list of timelineEvents for a user in the DynamoDB table.
     *
     * @param limit The maximum numbers of results for the scan
     * @return A List of TimelineEvent objects
     */
    List<TimelineEvent> getUserTimelineEvents(int limit, String username);

    String deleteTimelineEvent(String timelineEventId);
}
