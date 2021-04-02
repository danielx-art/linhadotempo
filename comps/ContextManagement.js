import React, {useState} from 'react'

export const SuperContext = React.createContext({

    language: "pt-br",
    setLanguage: () => {},

    windowDimensions: null,

    zoom: 1,
    setZoom: ()=> {},

    book: [],

    theme: 'default',
    setTheme: () => {}

});

export const SuperContextProvider = (props) => {

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
    
        book: [],
    
        theme: 'default',
        setTheme
    
    }

    const [state, setState] = useState(initState);

    return(
        <SuperContext.Provider value={state}>
            {props.children}
        </SuperContext.Provider>
    )
}