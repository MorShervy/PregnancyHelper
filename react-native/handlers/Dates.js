
//Calculating a Due Date
//A typical pregnancy lasts, on average, 
//280 days, or 40 weeks—starting with the first day of the last normal menstrual period as day 1. 
//An estimated due date can be calculated by following steps 1 through 3:

//First, determine the first day of your last menstrual period.

//Next, count back 3 calendar months from that date.

//Lastly, add 1 year and 7 days to that date.


export class DueDate {

    // calculate estimate child birth
    // by given last menstrual period
    // return new date string {month,day,year}
    static CalculateChildBirthByLastMenstrual(lastMenstrualDate) {
        var date = new Date(lastMenstrualDate);
        var newdate = new Date(date);

        newdate.setDate(newdate.getDate() + 280);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();

        return `${mm}/${dd}/${y}`
    }

    static CalculateLastMenstrualByDueDate(dueDate) {
        var date = new Date(dueDate);
        var newdate = new Date(date);

        newdate.setDate(newdate.getDate() - 280);

        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();

        return `${mm}/${dd}/${y}`
    }

} 