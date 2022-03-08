import { useState } from "react"
import { useHistory } from "react-router-dom"
import HuntRepository from "../../repositories/HuntRepository"

export const ConfirmDelete = ({toggleDeleteDialog, hunt }) => {
    const history = useHistory()

    const deleteHunt = () => {
        return HuntRepository.deleteHunt(hunt.id)
                .then(() => {
                    history.push("/home")
                })
    }

    return (
        <dialog id="dialog--delete" className="dialog--delete">
            <h2>Delete Hunt <br/> Are Your Sure?</h2>
            <button id="deleteConfirmButton"
                onClick={deleteHunt}>
                Yes
            </button>
            <button id="doNotDeleteButton"
                onClick={toggleDeleteDialog}>
                No
            </button>
        </dialog>
    )
}