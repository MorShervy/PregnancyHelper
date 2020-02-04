import { observable, action, computed } from 'mobx'



class CalendarStore {
    @observable filterWeek = null;
    @observable currWeek = 0;
    @observable isLoadVideo = false

    @action filter(currentWeek) {
        this.filterWeek = this.weeksData.filter(week => week.key === currentWeek)[0];
        return this.filterWeek;
    }

    @action setCurrWeek(week) {
        this.currWeek = week;

    }

    get currWeek() {
        return this.currWeek;
    }

    @action setIsLoadVideo(bool) {
        this.isLoadVideo = bool
    }

    get isLoadVideo() {
        return this.isLoadVideo
    }

}

const calendarStore = new CalendarStore();
export default calendarStore