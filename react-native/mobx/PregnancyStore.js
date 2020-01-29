const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";


import { decorate, observable, action, computed, runInAction, configure, observe } from 'mobx'
configure({ enforceActions: "observed" });
class PregnancyStore {

    @observable pregnant = null;
    @observable week = 0;
    @observable currWeek = 0;
    @observable pictures = [];

    @action getPregnancyByUserId = id => {
        // console.log('getPregnancyByUserId=', id)
        fetch(`${URL}/Pregnancy/${id}`)
            .then(response => response.json())
            .then(data => {
                runInAction(() => {
                    // console.log('data=', data)
                    this.pregnant = data;
                    return data;
                })
            })
    }

    @action setWeek(week) {
        this.week = week;
    }

    @action setCurrWeek = week => {
        // console.log('week=', week)
        this.currWeek = week;
    }

    get currWeek() {
        return this.currWeek;
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