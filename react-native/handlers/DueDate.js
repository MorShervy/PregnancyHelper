

export default class DueDate {


    static CalculateChildBirthByLastMenstrual(lastMenstrualDate) {
        var date = new Date(lastMenstrualDate);
        var newdate = new Date(date);

        newdate.setDate(newdate.getDate() + 280);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();

        return `${mm}/${dd}/${y}`
    }


    //Calculating a Due Date
    //A typical pregnancy lasts, on average, 
    //280 days, or 40 weeks—starting with the first day of the last normal menstrual period as day 1. 
    //An estimated due date can be calculated by following steps 1 through 3:

    //First, determine the first day of your last menstrual period.

    //Next, count back 3 calendar months from that date.

    //Lastly, add 1 year and 7 days to that date.


    // calculate estimate child birth
    // by given last menstrual period
    // return new date string {month,day,year}
    static CalculateChildBirthByLastMenstrual2(lastMenstrualDate) {
        let isLeapYear = false;
        let daysInMonth = 31;
        const sevenDaysToAdd = 7;
        const threeMonthToReduce = 3;

        const selectedYear = lastMenstrualDate.getFullYear();
        const selectedMonth = lastMenstrualDate.getMonth() + 1;
        const selectedDay = lastMenstrualDate.getDate();
        const curDayInNumber = lastMenstrualDate.getDay();

        let year;
        // in case selected month is Jan,Feb
        // or month is Mar, and selected day is below 25
        // no need to add one year
        if (selectedMonth < 3 || (selectedMonth === 3 && selectedDay < 25)) // months 1,2
            year = selectedYear;
        // else - selected month is Mar and selected day above 25
        // or month above Mar
        // need to add one year
        else
            year = selectedYear + 1;

        // reduce 3 months from selected month correctly
        let month = selectedMonth - threeMonthToReduce;
        if (month < 1) {
            month += 12
        }

        // setting maximom days in months correctly

        // If - true the current year is a leap year
        if (year % 400 === 0 || (year % 4 === 0 && !(year % 100 === 0)))
            isLeapYear = true;
        // setting maximum days for months Apr,Jun,Sep,Nov
        if (month === 4 || month === 6 || month === 9 || month === 11)
            daysInMonth -= 1;
        // setting maximum days for month 2 if leap year 
        if (month === 2 && isLeapYear)
            daysInMonth -= 2;
        // setting maximum days for month 2 if not leap year 
        if (month === 2 && !(isLeapYear))
            daysInMonth -= 3;

        // adding 7 days to selectedDay correctly
        let day = selectedDay + sevenDaysToAdd;
        // in case day is above the maximum of days in month
        if (day > daysInMonth) {
            day -= daysInMonth; // reducing the maximum days in current month with the day result
            // will recieve the day for next monnth
            month += 1;         // we adding one month according to
            // in case month is above 12 (error month = 13)
            if (month > 12) {
                month = 1;      // change month to Jan
            }
        }

        // after we've got the right date after adding 280 days equal to 7*40 weeks
        // now we can get the day in number to check the differnce between
        // current day in number with result day in number
        let resDayInNumber = new Date(`${month}/${day}/${year}`).getDay()

        // now we can handle each case correctly and do the task
        // 
        if (curDayInNumber == resDayInNumber) {
            return `${month}/${day}/${year}`;
        }
        else if (curDayInNumber < resDayInNumber) {
            let difference = curDayInNumber - resDayInNumber;
            if (day + difference < 1) {
                day = daysInMonth + day + curDayInNumber - resDayInNumber
                month -= 1;
                if (month < 1) {
                    month = 12;
                    year -= 1;
                }
            }
            else {
                day = day + difference;
            }
        }
        else if (curDayInNumber > resDayInNumber) {
            day = day + (curDayInNumber - 6) - resDayInNumber - 1;
        }
        return `${month}/${day}/${year}`
    }
} 