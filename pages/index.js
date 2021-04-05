
//import dynamic from 'next/dynamic'

import {useState, useEffect, useContext, createContext} from 'react'

//import {SuperContextProvider, SuperContext} from '../comps/ContextManagement';

import ZoomBar from '../comps/ZoomBar.js'

/* ---------- GET THE BOOK -----------*/
const envPath = process.env.NODE_ENV === "development" ? 
"http://localhost:3000"
: process.env.VERCEL_URL;

const bookPath = "/api/book";

export async function getStaticProps(context) {

    const book = await fetch(`${envPath + bookPath}`).then(res => res.json());

    return {
        props: {
            book
        }
    }
}

export const allContext = createContext();

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
    
        windowDimensions: null,
    
        zoom: 1,
        setZoom,
    
        book: props.book,
    
        theme: 'default',
        setTheme
    
    }

    const [state, setState] = useState(initState);

    console.log(state.book);

    return (
        <allContext.Provider value={state}>
            <div className="out_container">
                <ZoomBar />
                {state.book.map((el,index) => <div key={index}>{el.type}</div>)}
                
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