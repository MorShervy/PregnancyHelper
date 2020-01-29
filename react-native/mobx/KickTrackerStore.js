import { decorate, observable, action, computed, runInAction, configure } from 'mobx'
configure({ enforceActions: "observed" });

const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";



class KickTrackerStore {

    @observable list = null;


    @action getKickTrackers = (id) => {
        fetch(`${URL}/kicktracker/${id}`)
            .then(response => response.json())
            .then(data => {
                runInAction(() => {
                    // console.log('data=', data)
                    if (data.Message !== undefined)
                        this.list = null
                    else
                        this.list = data;
                    return true
                })
            })
    }
}

const kickTrackerStore = new KickTrackerStore();
export default kickTrackerStore;