const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";


import { decorate, observable, action, computed, runInAction, configure, observe } from 'mobx'
configure({ enforceActions: "observed" });
class PregnancyStore {

    @observable id = null;
    @observable week = 0;
    @observable currWeek = 0;

    @action setId(id) {
        this.id = id;
    }

    get id() {
        return this.id;
    }

    @action setWeek(week) {
        this.week = week;
    }

    get currWeek() {
        return this.currWeek;
    }

    @action setCurrWeek = week => {
        // console.log('week=', week)
        this.currWeek = week;
    }

    get week() {
        return this.week
    }


}

// decorate('PregnancyStore', {
//     getPregnancyByUserId: action
// })

const pregnancyStore = new PregnancyStore();
export default pregnancyStore;