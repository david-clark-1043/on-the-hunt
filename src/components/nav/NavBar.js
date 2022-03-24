import React from "react";
import { Link } from "react-router-dom";
import checkUser from "../../hooks/checkUser";
import "./NavBar.css";

export const NavBar = () => {

    const { getCurrentUser } = checkUser()

    return (
        <div className="navBar">
            <div className="navbar__item">
                <Link className="navbar__link" to="/home">Home</Link>
            </div>
            <div className="navbar__item ">
                <Link className="navbar__link" to="/hunts/create">New Hunt</Link>
            </div>
            <div className="navbar__item">
                <Link className="navbar__link" to="#"
                    onClick={
                        () => {
                            localStorage.removeItem("hunt_customer")
                        }
                    }>
                    Logout
                </Link>
            </div>
            <div className="navbar__item">
                {getCurrentUser().name}
            </div>
        </div>
    )
}