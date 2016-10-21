package cf.funge.aworldofplants.model.action;

/**
 * Created by Dillon on 2016-10-20.
 */
public class GetPlantHistoryResponse {
    String[] startTimes;
    String[] endTimes;
    String[] averages;
    String[] mins;
    String[] maxes;

    public String[] getStartTimes() {
        return startTimes;
    }

    public void setStartTimes(String[] startTimes) {
        this.startTimes = startTimes;
    }

    public String[] getEndTimes() {
        return endTimes;
    }

    public void setEndTimes(String[] endTimes) {
        this.endTimes = endTimes;
    }

    public String[] getAverages() {
        return averages;
    }

    public void setAverages(String[] averages) {
        this.averages = averages;
    }

    public String[] getMins() {
        return mins;
    }

    public void setMins(String[] mins) {
        this.mins = mins;
    }

    public String[] getMaxes() {
        return maxes;
    }

    public void setMaxes(String[] maxes) {
        this.maxes = maxes;
    }
}
