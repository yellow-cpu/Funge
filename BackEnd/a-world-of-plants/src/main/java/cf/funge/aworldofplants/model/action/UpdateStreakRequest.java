package cf.funge.aworldofplants.model.action;

/**
 * Bean for the update streak by user request.
 */
public class UpdateStreakRequest
{
    private String username;
    private int streak;
    private int timestamp;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public int getTimestamp() { return timestamp; }

    public void setTimestamp(int timestamp) { this.timestamp = timestamp; }
}
