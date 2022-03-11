/* global google */

import React, { useEffect, useRef, useState } from "react";
import "./MapComponent.css";

export const MapComponent = ({ center, zoom, children, onClick, onIdle }) => {
    const [map, setMap] = useState();
    const [position, SetPosition] = useState();
    const ref = useRef();

    const [mapOptions, setMapOptions] = useState({ center, zoom })


    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener("click", onClick);
            }

            if (onIdle) {
                map.addListener("idle", () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]
    );

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new google.maps.Map(ref.current, mapOptions));
        }
    }, [ref, map, mapOptions]);

    return <>
        <div ref={ref} id="map"></div>
        {/* {
        JSON.stringify(React.Children)
    } */}
        {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                // set the map prop on the child component
                return React.cloneElement(child, { map });
            }
        })}
    </>
}