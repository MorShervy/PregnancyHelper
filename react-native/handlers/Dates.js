
//Calculating a Due Date
//A typical pregnancy lasts, on average, 
//280 days, or 40 weeks—starting with the first day of the last normal menstrual period as day 1. 
//An estimated due date can be calculated by following steps 1 through 3:

//First, determine the first day of your last menstrual period.

//Next, count back 3 calendar months from that date.

//Lastly, add 1 year and 7 days to that date.


export class Dates {

    // calculate estimate child birth
    // by given last menstrual period
    // return new date string {month,day,year}
    static CalculateChildBirthByLastMenstrual(lastMenstrualDate) {
        console.log('lastMenstrualDate=', lastMenstrualDate)
        var date = new Date(lastMenstrualDate);
        var newdate = new Date(date);

        newdate.setDate(newdate.getDate() + 280);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();

        return `${mm}/${dd}/${y}`
    }

    static CalculateLastMenstrualByDueDate(dueDate) {
        console.log('dueDate=', dueDate)
        var date = new Date(dueDate);
        var newdate = new Date(date);

        newdate.setDate(newdate.getDate() - 280);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();

        return `${mm}/${dd}/${y}`
    }

    static CalculateDaysDifferenceBetweenTwoDates(date) {

        var dd = date.split('/')
        // console.log('dd=', `${dd[1]}/${dd[0]}/${dd[2]}`)
        var d1 = new Date(`${dd[1]}/${dd[0]}/${dd[2]}`);
        var d2 = new Date()

        var difference_in_time = d2.getTime() - d1.getTime();
        var difference_in_days = difference_in_time / (1000 * 3600 * 24)


        // console.log('d1=', d1)
        // console.log('d2=', d2)
        // console.log('difference_in_days=', difference_in_days / 7)
        return difference_in_days;
    }

    static GetDaysToGo(date) {

        var dd = date.split('/')
        // console.log('dd=', `${dd[1]}/${dd[0]}/${dd[2]}`)
        var d2 = new Date(`${dd[1]}/${dd[0]}/${dd[2]}`);
        var d1 = new Date()

        var difference_in_time = d2.getTime() - d1.getTime();
        var difference_in_days = difference_in_time / (1000 * 3600 * 24)


        // console.log('d1=', d1)
        // console.log('d2=', d2)
        // console.log('difference_in_days=', difference_in_days / 7)
        return difference_in_days;
    }

    static GetDiffByTwoDates(d1, d2) {

        // save the difference in time between the last contraction to the current contraction 
        var difference_in_time = d2.getTime() - d1.getTime();
        // get difference in hours (string)
        var difference_in_hour = this.pad((difference_in_time / (1000 * 3600)) | 0)
        // get difference in min (string)
        var difference_in_min = this.pad(((difference_in_time / (1000 * 3600) - parseInt(difference_in_time / (1000 * 3600))) * 60) | 0)
        // get difference in sec (string)
        var difference_in_sec = this.pad(((((difference_in_time / (1000 * 3600) - parseInt(difference_in_time / (1000 * 3600))) * 60)
            -
            (((difference_in_time / (1000 * 3600) - parseInt(difference_in_time / (1000 * 3600))) * 60) | 0)) * 60) | 0)

        return `${difference_in_hour}:${difference_in_min}:${difference_in_sec}`;
    }

    static pad(val) {
        let valStr = val + "";
        if (valStr.length < 2) {
            valStr = "0" + valStr
            return valStr
        }
        else
            return valStr
    }

} 