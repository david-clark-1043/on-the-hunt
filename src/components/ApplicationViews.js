import React from "react";
import { Route } from "react-router-dom";
import { CreateHunt } from "./hunts/CreateHunt";
import { Hunt } from "./hunts/Hunt";
import { MyHunts } from "./hunts/MyHunts";


export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/home">
                <MyHunts />
            </Route>
            <Route exact path="/hunts/create">
                <CreateHunt />
            </Route>
            <Route exact path="/hunts/:huntId(\d+)">
                <Hunt />
            </Route>
        </>
    )
}