import { observable, action, computed } from 'mobx'


class ContractionStore {

    @observable contraction = [];

    @action addContraction(length, timeApart, startTime, endTime) {
        this.contraction.push({ length: length, timeApart: timeApart, startTime: startTime, endTime: endTime });
    }

    get contraction() {
        return this.contraction
    }


}

const contractionStore = new ContractionStore();

export default contractionStore;