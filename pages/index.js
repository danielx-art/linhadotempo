
import {useState, useEffect, useContext, createContext} from 'react'

import ZoomBar from '../comps/ZoomBar.js'

import {useWindowSize} from '../comps/useWindowSize.js'

export const allContext = createContext();

/* ---------------------- GET THE BOOK ----------------------*/
const envPath = process.env.NODE_ENV === "development" ? 
"http://localhost:3000"
: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

const bookPath = "/api/book";

export async function getStaticProps(context) {

    //console.log(`The path is ${envPath + bookPath}`); //<-- This is outputting the absolute URL correctly

    const bookRaw = await fetch(envPath + bookPath);
    const test1 = bookRaw.json();
    const test2 = JSON.parse(bookRaw);
    console.log(test1);
    console.log("---------------divisao----------------");
    console.log(test2);
    
    //const book = bookRaw;
    const book = [];

    return {
        props: {
            book
        }
    }
}

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
                <div> Test: {props.book} </div>
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