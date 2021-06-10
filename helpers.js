import livro from './public/livro.json'

/*
the raw book comes in this format:
{
    id,
    titulo,
    tipo,
    data:   [  [year, month, day] , [year, month, day ] ],
    data2:  [  [year, month, day] , [year, month, day ] ],
    descricao,
    mais,
    personagens,
    tags
}

I will format it to be:
{
    id,
    tytle,
    type,
    dates = {
        initial: [ {year, month, day, timestamp, index, positioning*} , {year, month, day, timestamp, index, positioning*} ],
        final: [ {year, month, day, timestamp, index, positioning*} , {year, month, day, timestamp, index, positioning*} ]
    }
}

where index is the index of a crescent order of all timestamps, 
and positioning is an array [main axis position, cross-axis position]
*/

//1 FORMAT DATES AND BOOK
export function formatDates(rawBook) {

    let formattedBook = [];

    for(let i=0; i<rawBook.length; i++){

        const li = rawBook[i];                             
        const formattedEntry = {};
        
        const datesRaw = [];                                //this is just a helper array to loop wich stores the dates from the raw data
        const dates = {initial: [], final: []};             //this is where the formatted dates will be
        datesRaw.push(li.data);                             //push data
        if(li.data2) datesRaw.push(li.data2);               //push data2

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
                    timestamp,
                    positioning: [0,0]
                }
                j == 0 ? dates.initial.push(formattedDate) : dates.final.push(formattedDate);
            }
        }
        
        formattedEntry['id'] = li.id;
        formattedEntry['dates'] = dates;
        formattedEntry['type'] = li.tipo == "personagem" ? "persona" : li.tipo == "evento" ? "event" : "period";
        formattedEntry['title'] = li.titulo;
        formattedEntry['description'] = li.descricao;
        formattedEntry['tags'] = li.tags;
        formattedEntry['more'] = li.mais;
        formattedEntry['personas'] = li.personagens;
        formattedBook.push(formattedEntry);
    }

    return formattedBook;
}

//2 SORT AND INDEX ALL TIMESTAMPS
export function sortedTimestamps(book){

    const sortedTimestamps = [];

    //save all timestamps
    for(let i=0; i<book.length; i++){
        let item = book[i];
        for(let a=0; a<item.dates.initial.length; a++){
            sortedTimestamps.push(item.dates.initial[a].timestamp);
        }
        for(let b=0; b<item.dates.final.length; b++){
            sortedTimestamps.push(item.dates.final[b].timestamp);
        }
    }

    //then sort
    sortedTimestamps.sort((a,b) => a - b);

    // //save the index of the timestamp in the book reference
    // //So I have to loop through all timestamps again, find their index and save
    // // DEPRECATED
    // for(let i=0; i<book.length; i++){
    //     let item = book[i];
    //     for(let a=0; a<item.dates.initial.length; a++){
    //         let timestamp = item.dates.initial[a].timestamp;
    //         let index = sortedTimestamps.findIndex((stamp) => stamp == timestamp);
    //         item.dates.initial[a]['index'] = index;
    //     }
    //     for(let b=0; b<item.dates.final.length; b++){
    //         let timestamp = item.dates.final[b].timestamp;
    //         let index = sortedTimestamps.findIndex((stamp) => stamp == timestamp);
    //         item.dates.final[b]['index'] = index;
    //     }
    // }

    return sortedTimestamps;
}

//3 SEPARATE BOOK BY TYPE
export function categorizeBook(book){

    let separatedBook = {events: [], personas: [], periods: []};

    for(let i=0; i<book.length; i++){
        separatedBook[book[i].type+'s'].push(book[i]);
    }

    return separatedBook;
}

//HELPER FUNTION TO OVERLAPPING, it returns true if the event enext is overlapping the event ebef
//note that the cross-axis indent must also be equal, but also note below that this function will only be called in this case
const isOverlapping = (enext, ebef) => {
    if(ebef.dates.final.length == 0) return true; //meaning pbef doesnt have a final date, it is still going on
    const finalDateToCompare = ebef.dates.final[ebef.dates.final.length -1].timestamp;
    const initialDateToCompare = enext.dates.initial[0].timestamp;
    if(initialDateToCompare - finalDateToCompare < 0) return true; //meaning initialDateToCompare happened before the finalDateToCompare
    return false;
}

//4 SET CROSS AXIS OFFSET FOR PERIODS AND PERSONAS
export function crossOffsetPeriods(periods) {

    //  periods should get a an indent property
    //  wich enables me to control cross-axis positioning without
    //  overlapping elements

    let currentPeriod = null;
    let previousPeriods = [];

    for(let i=0; i<periods.length; i++){
        
        currentPeriod = periods[i];

        let offset = 0;

        for(let j=0; j<previousPeriods.length; j++){

            const overlap = offset == previousPeriods[j].dates.initial[0].positioning[1] ? isOverlapping(currentPeriod, previousPeriods[j]) : false;

            overlap ? offset ++ : null;

        }

        currentPeriod.dates.initial.forEach((initialDate)=>initialDate.positioning[1] = offset);
        currentPeriod.dates.final.forEach((finalDate)=>finalDate.positioning[1] = offset);
        previousPeriods.push(currentPeriod);

    }

}

//5 SET CROSS AXIS OFFSET FOR EVENTS (Silimar cross-axis offset but now we have to provide a 'collision' condition)
export function crossOffsetEvents(events, year_size, mesh_size){

    let currentEvent = null;
    let previousEvent = null;

    for(let i=0; i<events.length; i++){

        currentEvent = events[i];

        previousEvent ? null : previousEvent = currentEvent;

        let currentEventYear = currentEvent.dates.initial[0].year;
        let previousEventYear = previousEvent.dates.initial[0].year;

        let currentEventIndent = 
            (currentEventYear - previousEventYear)*year_size < 1.2*mesh_size 
            ? 
            previousEvent.dates.initial[0].positioning[1]
            : 
            previousEvent.dates.initial[0].positioning[1] + 1;

        currentEvent.dates.initial.forEach((date)=>date.positioning[1] = currentEventIndent);
        currentEvent.dates.final.forEach((date)=>date.positioning[1] = currentEventIndent);
    }
}

//6 HELPER FUNCTION TO FIND POSITIONING OF GIVEN TIMESTAMP
export function findPositioning (book, timestamp) {
    let positioning = [];

    outter:
    for(let item of book){
        for(let date in item.dates){
            for(let thisDate of item.dates[date]){
                if(thisDate.timestamp == timestamp){
                    positioning = thisDate.positioning;
                    break outter;
                }
            }
        }
    }

    return positioning
}

//7 CALCULATE POSITIONINGS
//NOTE:
//book should already be formatted
//distance_cap is in years
//mesh_size is the radius of the event blobs and the width of the periods and personas stripes
//cross_axis_spacing is a minimun value, that should be past 1.2*mesh_size
export function calculatePositionings(distance_cap = 10, year_size = 4, mesh_size = 2, cross_axis_spacing = 3) {

    let book = formatDates(livro);
    let {events, personas, periods} = categorizeBook(book);
    crossOffsetPeriods(periods);
    crossOffsetPeriods(personas);
    crossOffsetEvents(events, year_size, mesh_size);
    let sortedTimestampsArray = sortedTimestamps(book);

    //calculate main axis position based on cap_dist and year_size and set cross-axis positions as well to use the same loop
    book.forEach((item)=>{
        for(let date in item.dates){
            item.dates[date].forEach((thisDate) => {
                let index = sortedTimestampsArray.findIndex((timestamp)=> timestamp == thisDate.timestamp);
                //find the position of previous timestamp
                let previousPositioning = index > 0 ? findPositioning( book, sortedTimestampsArray[index-1] ) : thisDate.positioning;
                let previousTimestamp = index > 0 ? sortedTimestampsArray[index-1] : thisDate.timestamp;
                let diffInYears = (thisDate.timestamp - previousTimestamp)/(1000*3600*24*30*12);
                //is diff is bigger then a max (the cap), then set it to the cap, and position is previous position plys this diff 
                diffInYears = diffInYears >= distance_cap ? distance_cap*year_size : diffInYears*year_size;
                thisDate.positioning[0] = diffInYears + previousPositioning[0];
                //also set cross-axis positioning
                thisDate.positioning[1] = cross_axis_spacing >= 1.2*mesh_size ? thisDate.positioning[1]*cross_axis_spacing : thisDate.positioning[1]*1.2*mesh_size;
            })
        }
    });

    return book;
};