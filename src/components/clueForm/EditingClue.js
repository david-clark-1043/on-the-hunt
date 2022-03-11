/* global google */

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import Settings from "../../repositories/Settings";
import { MapComponent } from "../MapComponent/MapComponent";
import { Marker } from "../MapComponent/MarkerComponent";

export const ClueEditing = ({ currentClue, handleClueInput, clueTypes, editingClue, setEditing, saveStep, setCurrentClue }) => {
    // currentClue - state object
    // handleClueInput - function
    // clueTypes - state value
    // editingClue - state value
    // setEditing - state function

    const MAPS_API_KEY = Settings.API_KEY
    const [center, setCenter] = useState({ lat: 36.12961419432934, lng: -86.83921234262075 });
    const [click, setClick] = useState(currentClue.lat ? {lat: currentClue.lat, lng: currentClue.lng} : { lat: 36.12961419432934, lng: -86.83921234262075 });
    const [zoom, setZoom] = useState(10); // initial zoom
    const [position, SetPosition] = useState()

    useEffect(
        () => {
            if(currentClue.lat) {
                const copyClick = JSON.parse(JSON.stringify(click))
                copyClick.lat = currentClue.lat
                copyClick.lng = currentClue.lng
            }
        }, [currentClue]
    )

    useEffect(
        () => {
            if (typeof click.lat === "function") {
                const lat = click.lat()
                const lng = click.lng()
                const copy = JSON.parse(JSON.stringify(currentClue))
                copy.lat = lat
                copy.lng = lng
                setCurrentClue(copy)
            }
        }, [click]
    )

    const changePosition = (event) => {
        const copy = JSON.parse(JSON.stringify(position))
        copy[event.target.id] = parseFloat(event.target.value)
        SetPosition(copy)
    }

    const onClick = (e) => {
        // avoid directly mutating state
        setClick(e.latLng);
        SetPosition(e.latLng)
    };

    const onIdle = (m) => {
        console.log("onIdle");
        setZoom(m.getZoom());
        setCenter(m.getCenter().toJSON());
    };
    const render = (status) => {
        switch (status) {
            case Status.LOADING:
                return <div>Loading</div>;
            case Status.FAILURE:
                return <div>FAILURE</div>;
            case Status.SUCCESS:
                return <MapComponent center={center} zoom={zoom} onClick={onClick} onIdle={onIdle}>
                    <Marker position={click} />
                </MapComponent>;
        }
    };
    // saveStep - function
    return <>
        <div className="editingClue">

            <div>Editing Clue</div>
            <fieldset>
                <div className="clueText">
                    <label htmlFor="clueText">Clue Hint: </label>
                    <input
                        required autoFocus
                        type="text"
                        id="clueText"
                        className="form-control"
                        // placeholder="Add Hint"
                        defaultValue={currentClue.clueText}
                        onChange={handleClueInput} />
                </div>
            </fieldset>
            <fieldset>
                <div className="clueType">
                    Choose Clue type
                    {
                        clueTypes.map(type => {
                            return <div className="typeInput" key={`type-${type.id}`}>
                                <input type="radio"
                                    key={`type--${type.id}`}
                                    name="clueType"
                                    id="clueTypeId"
                                    value={`${type.id}`}
                                    onChange={(e) => handleClueInput(e, true)}
                                    checked={currentClue.clueTypeId === type.id} />
                                {type.type}
                            </div>
                        })
                    }
                </div>
            </fieldset>
            {currentClue.clueTypeId
                ? currentClue.clueTypeId === 1
                    ? <>
                        <Wrapper apiKey={MAPS_API_KEY} render={render} />
                        <fieldset>
                            <label htmlFor="clueAnswer">Clue Answer: </label>
                            <input
                                required autoFocus
                                type="text"
                                id="clueAnswer"
                                className="form-control"
                                defaultValue={currentClue.clueAnswer}
                                onChange={handleClueInput} />
                        </fieldset>
                    </>
                    : <fieldset>
                        <label htmlFor="clueAnswer">Clue Answer: </label>
                        <input
                            required autoFocus
                            type="text"
                            id="clueAnswer"
                            className="form-control"
                            defaultValue={currentClue.clueAnswer}
                            onChange={handleClueInput} />
                    </fieldset>
                : null
            }
            <div className="buttonControls">
                <button className="saveStep" onClick={saveStep}>Save step</button>
                <button className="clueBack"
                    onClick={(e) => {
                        e.preventDefault()
                        setEditing(!editingClue)
                        setCurrentClue({ clueTypeId: 0 })
                    }
                    }>
                    Back
                </button>
            </div>
        </div>
    </>
}