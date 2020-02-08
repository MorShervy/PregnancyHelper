
import { decorate, observable, action, computed, runInAction, configure } from 'mobx'
configure({ enforceActions: "observed" });

const HOUR_IN_SEC = 3600
const MIN_IN_SEC = 60

const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";


class ContractionStore {


    AverageInLastHour(arrList) {
        var toDate = new Date()

        var filteredCon = arrList.filter(con =>
            new Date(con.DateTime).getFullYear() === toDate.getFullYear() &&
            new Date(con.DateTime).getMonth() === toDate.getMonth() &&
            new Date(con.DateTime).getDate() === toDate.getDate()
        )
        // console.log('filteredCon=', filteredCon)
        var ONE_HOUR = 60 * 60 * 1000; /* ms */
        var filteredConInLastHour = filteredCon.filter(con => ((new Date) - new Date(con.DateTime)) < ONE_HOUR)
        var avgLength = this.getAvgLength(filteredConInLastHour)
        // console.log('avgLength=', avgLength)
        var avgTimeApart = this.getAvgTimeApart(filteredConInLastHour)
        // console.log('avgTimeApart=', avgTimeApart);

        return { avgLength, avgTimeApart }
    }

    getAvgLength = arr => {
        console.log('getAvgLength arr=', arr)
        let sec = 0;
        let min = 0;
        let hour = 0;
        arr.forEach(con => {
            sec += parseInt(con.Length.split(':')[2])
            min += parseInt(con.Length.split(':')[1])
            hour += parseInt(con.Length.split(':')[0])
        });
        let sumInSec = (hour * 60 * 60) + (min * 60) + sec;
        let avgInSec = sumInSec / arr.length
        // console.log('h=', hour, 'm=', min, 's=', sec)
        // console.log('avgInSec=', avgInSec)
        if (avgInSec >= HOUR_IN_SEC) {

        }
        else if (avgInSec >= MIN_IN_SEC) {
            return `${(avgInSec / MIN_IN_SEC) | 0}m ${parseInt(((avgInSec / MIN_IN_SEC) - ((avgInSec / MIN_IN_SEC) | 0)) * 60) + 1}s`
        }
        else {
            return `${avgInSec | 0}s`
        }
    }

    getAvgTimeApart = arr => {
        console.log('getAvgTimeApart arr=', arr)
        let sec = 0;
        let min = 0;
        let hour = 0;
        arr.forEach((con, index) => {
            if (index !== 0) {
                sec += parseInt(con.TimeApart.split(':')[2])
                min += parseInt(con.TimeApart.split(':')[1])
                hour += parseInt(con.TimeApart.split(':')[0])
            }
        });
        let sumInSec = (hour * 60 * 60) + (min * 60) + sec;
        let avgInSec = sumInSec / (arr.length - 1)
        // console.log('h=', hour, 'm=', min, 's=', sec)
        // console.log('avgInSec=', (arr.length - 1))
        if (avgInSec >= HOUR_IN_SEC) {

        }
        else if (avgInSec >= MIN_IN_SEC) {
            return `${(avgInSec / MIN_IN_SEC) | 0}m ${parseInt(((avgInSec / MIN_IN_SEC) - ((avgInSec / MIN_IN_SEC) | 0)) * 60)}s`
        }
        else {
            return `${avgInSec | 0}s`
        }
    }

}

const contractionStore = new ContractionStore();

export default contractionStore;