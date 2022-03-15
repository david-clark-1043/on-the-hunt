import {useState} from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import "./OnTheHunt.css";
import { Footer } from "./footer/Footer";

export const OnTheHunt = () => {

    return (
        <>
            <Route
                render={() => {
                    if (localStorage.getItem("hunt_customer")) {
                        return (
                            <> 
                                <div className="pageHeader">
                                <div>
                                    <img className="mapImg" src="/android-chrome-512x512.png"/>
                                    </div>
                                <h1>On the Hunt</h1>
                                </div>
                                <NavBar />
                                <ApplicationViews />
                                <Footer />
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