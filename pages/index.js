
import dynamic from 'next/dynamic'
import {useState, useEffect} from 'react'

const Barra = dynamic(() => import('../comps/barra.js'));

export async function getStaticProps(context) {
    
    const livroData = await import("../public/livro.json");
    const livroRaw = livroData.default;
    
    //Função factory que cria objeto livro
    const createLivro = (raw) => {

        /* how the element should be:

        Year --
        {
            characters:
        }



        {
            id,
            type: "evento", "personagem" ou "periodo",
            dates: {
                initial: [{ year, month, day, timestamp}, //segunda aproximação {year, month, day timestamp}]
                final: // mesma coisa que inicial
            },
            description: "...",
            more: "..."
            characters: ["...", "..."],
            tags: ["...", "..."]
        }
        */

        const byYears = [];

        //LOOP TROUGH THE BOOK
        for(let i=0; i<raw.length; i++){
            //i refers to the book element in question
            const li = raw[i];

            //1.ORGANIZE THE DATES
            const datesRaw = []; //this is just a helper array to loop
            const dates = {initial: [], final: []}; //this is where the formatted dates will be
            datesRaw.push(li.data);
            if(li.data2) {
                datesRaw.push(li.data2)
            }
            for(let j=0; j<datesRaw.length; j++){
                //j refers to the date, if it is date1, then j=0, date2 then j=1
                for(let k=0; k<datesRaw[j].length; k++){
                    //k refers to the dates of approximation in case date1 or date 2 have more then one date
                    const year = datesRaw[j][k][0]; //this is the year of the k-th approximation of date j on element i
                    const month = (datesRaw[j][k][1]) ? datesRaw[j][k][1] : false;
                    const day = (datesRaw[j][k][2]) ? datesRaw[j][k][2] : false;
                    const dateobj = new Date(year.toString(), (month == true) ? month.toString()-1 : "00", (day == true) ? day.toString() : "01");
                    const timestamp = dateobj.getTime();
                    //console.log(timestamp); //debugg
                    const formattedDate = {
                        year,
                        month,
                        day,
                        timestamp
                    }
                    j == 0 ? dates.initial.push(formattedDate) : dates.final.push(formattedDate);
                }
            }
            
            li['dates'] = dates;  //instead of putting this on li, create another new object entry for the new book

            //2. ORGANIZE PERIODS INDEX
            let previousPeriod = null;
            let currentPeriod = null;
            if(li.tipo == 'periodo') {
                currentPeriod = li;

                                
            }

        }//loop through raw book


        const self = {
            all: raw,
            byYears
        };
        return self;
    }

    const livro = createLivro(livroRaw);

    const addYear = (year) => {
        return {
            year,
            events: [],
            addEvent(obj) { return this.events.push(obj) },
            getSize() { return this.events.length },
        }
    }


    return {
        props: {
            livro: livroRaw
        }
    }
}

function Home(props){

    /* here ill calculate a size of the div using a yearSize instead of fixing a height and using proportions */
    const livro = props.livro;
    const initialYear = livro[0].data[0][0];
    const finalYear = (livro[livro.length-1].data2 ? livro[livro.length-1].data2[0][0]: livro[livro.length-1].data[0][0]);
    const lenghtYears = finalYear - initialYear;
    const yearSize = 12;
    
    const windowDimensions = useWindowSize();
    const [zoomCheck, setZoomCheck] = useState(true);
    const [zoom, setZoom] = useState(
        windowDimensions.height/Math.max(lenghtYears*yearSize, 1)
    );

    const containerL = (lenghtYears*yearSize)*zoom/100;

    function handleZoom(e) {
        setZoom(e.currentTarget.value);
    }

    function handleCheckZoom(e) {
        setZoomCheck(e.currentTarget.checked);
        (e.currentTarget.checked == false) ? setZoom(windowDimensions.height/Math.max(lenghtYears*yearSize, 1)) : null
    }

    return (
        <div className="out_container">
            <div className="zoom-options">
                <input type="checkbox" name="zoom" checked={zoomCheck} onChange = {handleCheckZoom}></input>
                <label htmlFor="zoom"> zoom </label>
                <input 
                type="range" min="1" max="100" value={zoom} className="slider" onInput = {handleZoom} disabled={!zoomCheck}></input>
            </div>
            <Barra props={{livro, containerL, initialYear, finalYear, lenghtYears, yearSize}}></Barra>
            <style jsx>{`
                .out_container{
                    position: relative;
                }
            `}</style>
        </div>
    )
}

export default Home;


/* -------------------------------------------
------ Hook for different windows sizes ------
---------------------------------------------*/
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: 500,
      height: 500,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      
        // Add event listener
        window.addEventListener("resize", handleResize);
       
        // Call handler right away so state gets updated with initial window size
        handleResize();
      
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }