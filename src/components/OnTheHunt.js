import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import "./OnTheHunt.css";

export const OnTheHunt = () => {
    return (
        <>
            <Route
                render={() => {
                    if (localStorage.getItem("hunt_customer")) {
                        return (
                            <> 
                                <h1>On the Hunt</h1>
                                <NavBar />
                                <ApplicationViews />
                            </>
                        );
                    } else {
                        return <Redirect to="/login" />;
                    }
                }}
            />

            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
        </>
    )
}