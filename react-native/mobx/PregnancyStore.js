const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

import { observable, action, computed, runInAction } from 'mobx'

class PregnancyStore {

    @observable pregnant = {};
    @observable week = 0;
    @observable pictures = [];

    @action getPregnancyByUserId = id => {
        console.log('id=', id)
        fetch(`${URL}/Pregnancy/${id}`)
            .then(response => response.json())
            .then(data => {
                runInAction(() => {
                    // console.log('data=', data)
                    this.pregnant = data;
                })
            })
    }

    @action setWeek = week => {
        console.log('week=', week)
        this.week = week;
    }

}

const pregnancyStore = new PregnancyStore();
export default pregnancyStore;