//import livro from '../public/livro.json'

import {calculatePositionings} from '../helpers'

import {useState, useEffect, createContext} from 'react'

//import {useWindowSize} from '../comps/useWindowSize.js'

import Main from '../comps/three/Main'

export const allContext = createContext();

export async function getStaticProps(context) {

    let book = calculatePositionings();

    return {
        props: {
            book
        }
    }
}


/*--------------------------------------------------------------------------
----------------------------------HOME--------------------------------------
--------------------------------------------------------------------------*/

export default function Home(props){

    const setLanguage = (language) => {
        setState({...state, language: language});
    }

    const setZoom = (value) => {
        setState({...state, zoom: value});
    }

    const setTheme = ({color, orientation, year_size}) => {
        setState({...state, theme: {color, orientation, year_size}});
    }

    const setSelectedObject = (objectID) => {
        setState({...state, selectedObject: objectID});
    }

    const initState = {

        language: "pt-br",
        setLanguage,
    
        zoom: 1,
        setZoom,
    
        book: props.book,

        lastPosition: props.lastPosition,
    
        theme: {color: 'default', orientation: [0, -1], year_size: 4}, //implement this
        setTheme,

        selectedObject: -1,
        setSelectedObject
    
    }

    const [state, setState] = useState(initState);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    return (
        <allContext.Provider value={state}>
            {/* <div> Test: {props.book.map((el, index) => <div key={index}>{el.title}</div>)} </div> */}
            {mounted && <Main />}
            
        </allContext.Provider>
    )
}