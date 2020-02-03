const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

import { observable, action, computed, runInAction } from 'mobx'


class UserStore {

    @observable id = null;
    @observable user = {}

    @action getUserAsync = id => {
        // console.log('id=', id)
        fetch(`${URL}/User/${id}`)
            .then(response => response.json())
            .then(data => {
                runInAction(() => {
                    // console.log('data=', data)
                    this.user = data;
                    return true;
                })
            })
    }

    @action setId(id) {
        this.id = id;
    }

    get id() {
        return this.id;
    }

}

const userStore = new UserStore();
export default userStore;