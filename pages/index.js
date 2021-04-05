import livro from '../public/livro.json'

import {useState, useEffect, createContext} from 'react'

import ZoomBar from '../comps/ZoomBar.js'

import {useWindowSize} from '../comps/useWindowSize.js'

export const allContext = createContext();

/* ---------------------- GET THE BOOK ----------------------*/
const envPath = process.env.NODE_ENV === "development" ? 
"http://localhost:3000"
: `${process.env.NEXT_PUBLIC_VERCEL_URL}`;

const bookPath = "/livro.json";

const pathToBook = envPath + bookPath;

export async function getStaticProps(context) {

    let livroRaw = await JSON.parse(livro);
    let formattedBook = [];

    // //1. if file doesnt exist, return empty response
    // if (!fs.existsSync(pathToBook)) {
    //     return  {
    //             props: {
    //                 book: []
    //             }
    //     }
    // }

    //2. load the file
    // const file = await fs.readFileSync(pathToBook);
    // livroRaw = await JSON.parse(file);

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
    // will do the same with periods for the exact same reason
    let currentPersona = null;
    let previousPersonas = [];
    //-----------------------------------------------

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

        

        //HELPER FUNTION TO BE USED IN 3.B AND 3.C, it returns true if the event enext is overlapping the event ebef
        //note that the indent must also be equal, but also note below that this function will only be called in this case
        const isOverlapping = (enext, ebef) => {
            if(ebef.dates.final.length == 0) return true; //meaning pbef doesnt have a final date, it is still going on
            const finalDateToCompare = ebef.dates.final[ebef.dates.final.length -1].timestamp;
            const initialDateToCompare = enext.dates.initial[0].timestamp;
            if(initialDateToCompare - finalDateToCompare < 0) return true; //meaning initialDateToCompare happened before the finalDateToCompare
            return false;
        }

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

    console.log(formattedBook);

    return {
        props: {
            book: formattedBook
        }
    }
}


/*--------------------------------------------------------------------------
----------------------------------HOME--------------------------------------
--------------------------------------------------------------------------*/

export default function Home(props){

    const setLanguage = (language) => {
      setState({...state, language: language})
    }

    const setZoom = (value) => {
        setState({...state, zoom: value});
    }

    const setTheme = (theme) => {
        setState({...state, theme: theme})
    }

    const initState = {

        language: "pt-br",
        setLanguage,
    
        zoom: 1,
        setZoom,
    
        book: props.book,
    
        theme: 'default',
        setTheme
    
    }

    const [state, setState] = useState(initState);

    return (
        <allContext.Provider value={state}>
            <div className="out_container">
                <ZoomBar />
                <div> Test: {props.book.map((el, index) => <div key={index}>{el.titulo}</div>)} </div>
                <style jsx>{`
                    .out_container{
                        position: relative;
                        margin: 0;
                        padding: 0;
                        height: 100vh;
                        width: 100vw;
                    }
                `}</style>
            </div>
        </allContext.Provider>
    )
}