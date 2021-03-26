//import livroJSON from '../../public/livro.json';

import fs from 'fs'

const path = '../../public/livro.json';


export default function getLivro() {

    const livroRaw = [];
    const formattedBook = [];

    //1. if file doesnt exist, return empty response
    if (!fs.existsSync(path)) {
        res.json([]);
    }

    //2. load the file
    const file = fs.readFileSync(path);
    livroRaw = JSON.parse(usersRaw);

    //3. FORMAT

    //  -------------------NOTES -------------------
    
    //  -------------------DATES -------------------
    //  the raw book comes in this format:
    //  data:   [  [year, month, day] , [year, month, day ] ],
    //  data2:  [  [year, month, day] , [year, month, day ] ]
    //  I will format it to be:
    //  dates = {
    //      initial: [ {year, month, day, timestamp} , {year, month, day, timestamp} ],
    //      final: [ {year, month, day, timestamp} , {year, month, day, timestamp} ]
    //  }
    //  
    //  -------------------PERIODS-------------------
    //  periods should get a period key, with an indent property
    //  wich enables me to control horizontal positioning without
    //  overlapping elements
    //  period: {
    //      indent
    //  }
    //  to do that, i use helper variables to track the current and
    //  the previous period (default null) and the current indent used
    let currentPeriod = null;
    let previousPeriod = null;
    let indent = 0;
    //  ----------------------------------------------

    // LOOP THROUGH THE BOOK:

    for(let i=0; i<livroRaw.length; i++){

        const li = livroRaw[i];                             //current entry in loop
        const formattedEntry = {};
        
        //3.A. FORMAT DATES
        const datesRaw = [];                                //this is just a helper array to loop wich stores the dates from the raw data
        const dates = {initial: [], final: []};             //this is where the formatted dates will be
        datesRaw.push(li.data);                             //push data
        if(li.data2) datesRaw.push(li.data2);               //push data2

        //loop through the raw dates
        for(let j=0; j<datesRaw.length; j++){
            //j refers to the date, if it is date1, then j=0, date2 then j=1
            for(let k=0; k<datesRaw[j].length; k++){
                //k refers to the dates of approximation in case date1 or date 2 have more then one date
                const year = datesRaw[j][k][0]; //this is the year of the k-th approximation of date j on element i
                const month = (datesRaw[j][k][1]) ? datesRaw[j][k][1] : null;
                const day = (datesRaw[j][k][2]) ? datesRaw[j][k][2] : null;
                const thisDate = new Date(year.toString(), month ? month.toString()-1 : "00", day ? day.toString() : "01");
                const timestamp = thisDate.getTime();
                const formattedDate = {
                    year,
                    month,
                    day,
                    timestamp
                }
                j == 0 ? dates.initial.push(formattedDate) : dates.final.push(formattedDate);
            }
        }
        
        //put dates in formattedEntry and also in current raw entry to facilitate
        formattedEntry['dates'] = dates;
        li['dates'] = dates;

        //3.b FORMAT PERIODS
        if(li.tipo == 'periodo') {

            currentPeriod = li;

            if(previousPeriod){
                //test if it has a final date, if there is, compare, and if theres not, increment indent
                if(previousPeriod.dates.final.length > 0) {
                    //compare the bigger one
                    if(previousPeriod.dates.final[previousPeriod.dates.final.length].timestamp > currentPeriod.dates.initial[0].timestamp){
                        formattedEntry['period']
                    }
                }

            } else {
                //if theres no previous period then just initialize with indent 0
                formattedEntry['period'] = {indent}
            }

        }   

    }


}