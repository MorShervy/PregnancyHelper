const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";


import { decorate, observable, action, computed, runInAction, configure, observe } from 'mobx'
configure({ enforceActions: "observed" });
class PregnancyStore {
    @observable pregnant = null;
    @observable id = null;
    @observable week = 0;
    @observable currWeek = 0;
    @observable duedate = null;
    @observable gender = null;
    @observable childName = null;

    @action setPregnant(pregnant) {
        console.log('mobx pregna=', pregnant)
        this.pregnant = { pregnant };
    }

    get pregnant() {
        this.pregnant;
    }
    @action setDuedate(duedate) {
        this.duedate = duedate;
    }

    get duedate() {
        return this.duedate;
    }

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

    @action setGender(gender) {
        this.gender = gender;
    }

    get gender() {
        return this.gender;
    }

    @action setChildName(childName) {
        console.log('childName=', childName)
        this.childName = childName;
    }

    get childName() {
        return this.childName;
    }


}

// decorate('PregnancyStore', {
//     getPregnancyByUserId: action
// })

const pregnancyStore = new PregnancyStore();
export default pregnancyStore;