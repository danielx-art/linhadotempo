import livro from './public/livro.json'


//HELPER FUNTION TO BE USED IN 3.B AND 3.C, it returns true if the event enext is overlapping the event ebef
//note that the indent must also be equal, but also note below that this function will only be called in this case
const isOverlapping = (enext, ebef) => {
    if(ebef.dates.final.length == 0) return true; //meaning pbef doesnt have a final date, it is still going on
    const finalDateToCompare = ebef.dates.final[ebef.dates.final.length -1].timestamp;
    const initialDateToCompare = enext.dates.initial[0].timestamp;
    if(initialDateToCompare - finalDateToCompare < 0) return true; //meaning initialDateToCompare happened before the finalDateToCompare
    return false;
}

/*--------------------------------------------------------------------------
--------------------FUNCTION TO FORMAT THE DATA-----------------------------
--------------------------------------------------------------------------*/

export function getLivro() {

    let formattedBook = [];

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
    //  wich enables me to control cross-axis positioning without
    //  overlapping elements
    //  period: {
    //      indent
    //  }
    //  to do that, i use helper variables to track the current and
    //  the previous periods (default null and empty)
    let currentPeriod = null;
    let previousPeriods = [];
    //
    // -------------------PERSONAS-------------------
    // will do the same with personas for the exact same reason
    let currentPersona = null;
    let previousPersonas = [];
    //-----------------------------------------------

    // LOOP THROUGH THE BOOK:

    for(let i=0; i<livro.length; i++){

        const li = livro[i];                             //current entry in loop
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

        //3.B FORMAT PERIODS
        if(li.tipo == 'periodo') {

            currentPeriod = li;

            let indent = 0;

            for(let j=0; j<previousPeriods.length; j++){

                const overlap = indent == previousPeriods[j].period.indent ? isOverlapping(currentPeriod, previousPeriods[j]) : false;

                if(overlap) {
                    indent ++;
                    continue;
                }
                break;
            }

            formattedEntry['period'] = {indent};
            li['period'] = {indent};
            previousPeriods.push(li);
        }

        //3.C FORMAT PERSONAS
        if(li.tipo == 'personagem') {

            currentPersona = li;

            let indent = 0;

            for(let j=0; j<previousPersonas.length; j++){

                const overlap = indent == previousPersonas[j].persona.indent ? isOverlapping(currentPersona, previousPersonas[j]) : false;

                if(overlap) {
                    indent ++;
                    continue;
                }
                break;
            }

            formattedEntry['persona'] = {indent};
            li['persona'] = {indent};
            previousPersonas.push(li);
        }

        formattedEntry['type'] = li.tipo;
        formattedEntry['title'] = li.titulo;
        formattedEntry['description'] = li.descricao;
        formattedEntry['tags'] = li.tags;
        formattedEntry['more'] = li.mais;
        formattedEntry['personas'] = li.personagens;
        formattedBook.push(formattedEntry);
    } // end of looping through the book

    //4. ORDER POSITIONING TO AVOID REALLY LONG RENDERS
    // LOOP THROUGH THE BOOK again and store all dates timestamps, 
    // then sort it and store that index

    const sortedTimestamps = [];

    //4.a save all timestamps
    for(let i=0; i<formattedBook.length; i++){
        let item = formattedBook[i];
        for(let a=0; a<item.dates.initial.length; a++){
            sortedTimestamps.push(item.dates.initial[a].timestamp);
        }
        for(let b=0; b<item.dates.final.length; b++){
            sortedTimestamps.push(item.dates.final[b].timestamp);
        }
    }

    //4.b. sort all timestamps
    sortedTimestamps.sort((a,b) => a - b);

    //4.c save the index of the timestamp in the book reference
    //So I have to loop through all timestamps again, find their index and save
    for(let i=0; i<formattedBook.length; i++){
        let item = formattedBook[i];
        for(let a=0; a<item.dates.initial.length; a++){
            let timestamp = item.dates.initial[a].timestamp;
            let index = sortedTimestamps.findIndex((stamp) => stamp == timestamp);
            item.dates.initial[a]['index'] = index;
        }
        for(let b=0; b<item.dates.final.length; b++){
            let timestamp = item.dates.final[b].timestamp;
            let index = sortedTimestamps.findIndex((stamp) => stamp == timestamp);
            item.dates.final[b]['index'] = index;
        }
    }

    return {book: formattedBook, sortedTimestamps};

}

export function groupEvents()