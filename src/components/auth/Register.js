import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import Settings from "../../repositories/Settings";
import { Modal } from "react-dialog-polyfill"
import "./Login.css"

export const Register = (props) => {
    const [customer, setCustomer] = useState({})
    const [conflictDialog, setConflictDialog] = useState()

    const history = useHistory()

    const existingUserCheck = () => {
        return fetch(`${Settings.remoteURL}/users?email=${customer.email}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }
    const handleRegister = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch(`${Settings.remoteURL}/users`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(customer)
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                localStorage.setItem("hunt_customer", createdUser.id)
                                history.push("/home")
                            }
                        })
                }
                else {
                    setConflictDialog(true)
                }
            })
    }

    const updateCustomer = (evt) => {
        const copy = {...customer}
        copy[evt.target.id] = evt.target.value
        setCustomer(copy)
    }


    return (
        <main style={{ textAlign: "center" }}>
            <Modal open={conflictDialog}
                onCancel={(e, dialog) => {
                    e.preventDefault()
                    setConflictDialog(false)
                }}
                onClose={(e, dialog) => {
                    setConflictDialog(false)
                }}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
            </Modal>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Please Register for On the Hunt</h1>
                <fieldset>
                    <label htmlFor="name"> Full Name </label>
                    <input onChange={updateCustomer}
                           type="text" id="name" className="form-control"
                           placeholder="Enter your name" required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="address"> Address </label>
                    <input onChange={updateCustomer} type="text" id="address" className="form-control" placeholder="Street address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="email"> Email address </label>
                    <input onChange={updateCustomer} type="email" id="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <button type="submit"> Register </button>
                </fieldset>
            </form>
        </main>
    )
}

