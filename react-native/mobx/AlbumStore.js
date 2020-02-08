import { observable, action, computed, runInAction } from 'mobx'

const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

class AlbumStore {

    @observable week = 0;


    @action setWeek(week) {
        this.week = week;
    }

    get week() {
        return this.week;
    }
}

const albumStore = new AlbumStore();
export default albumStore