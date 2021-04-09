import {useContext, useState, useRef} from 'react';

import {allContext} from '../pages/index';

export default function ZoomBar() {

    const {zoom, setZoom} = useContext(allContext);
    const [zoomCheck, setZoomCheck] = useState(false);

    const sliderValue = useRef(null);

    function handleZoom(e) {
        setZoom(e.currentTarget.value);
    }

    function handleCheckZoom(e) {
        setZoomCheck(e.currentTarget.checked);
        if(e.currentTarget.checked == false) {
            setZoom(1);
            sliderValue.current.value = 1;
        }
    }

    return (
        <div className="zoom-options">
            <input type="checkbox" name="zoom" defaultChecked={zoomCheck} onChange = {handleCheckZoom}></input>
            <label htmlFor="zoom"> zoom </label>
            <input type="range" min="1" max="2" step="0.1" defaultValue={1} 
                className="slider" onInput = {handleZoom} disabled={!zoomCheck}
                ref = {sliderValue}>
            </input>
        </div>
    )
}