
import {useState, useEffect, useContext, createContext} from 'react'

import ZoomBar from '../comps/ZoomBar.js'

import {useWindowSize} from '../comps/useWindowSize.js'

import path from 'path'

export const allContext = createContext();

/* ---------------------- GET THE BOOK ----------------------*/
// const envPath = process.env.NODE_ENV === "development" ? 
// "http://localhost:3000"
// : process.env.VERCEL_URL;

// const bookPath = "/api/book";

const pathToBook = path.resolve('./public', 'livro.json');

export async function getStaticProps(context) {

    const book = await fetch(`${pathToBook}`).then(res => res.json());

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