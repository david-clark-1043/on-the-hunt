import React, { useRef, useState } from "react"
import { Link } from "react-router-dom";
import Settings from "../../repositories/Settings";
import { useHistory } from "react-router-dom"
import { Modal } from "react-dialog-polyfill"
import "./Login.css"

export const Login = () => {
    const [email, set] = useState("")
    const [existDialog, setExistDialog] = useState(false)
    const history = useHistory()

    const existingUserCheck = () => {
        return fetch(`${Settings.remoteURL}/users?email=${email}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then(exists => {
                if (exists) {
                    localStorage.setItem("hunt_customer", exists.id)
                    history.push("/home")
                } else {
                    setExistDialog(true)
                }
            })
    }

    return (
        <main className="container--login">
            <Modal open={existDialog}
                onCancel={(e, dialog) => {
                    e.preventDefault()
                    setExistDialog(false)
                }}
                onClose={(e, dialog) => {
                    setExistDialog(false)
                }}>
                <div>User does not exist</div>
                <button className="button--close" onClick={e => setExistDialog(false)}>Close</button>
            </Modal>

            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>On the Hunt</h1>
                    <h2>Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email"
                            onChange={evt => set(evt.target.value)}
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                    <fieldset>
                        <button type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
            </section>
        </main>
    )
}

