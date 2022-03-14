import { useHistory } from "react-router-dom"
import HuntRepository from "../../repositories/HuntRepository"
import { Modal } from 'react-dialog-polyfill'

export const ConfirmDelete = ({ modal, setModal, hunt }) => {
    const history = useHistory()

    const deleteHunt = () => {
        return HuntRepository.deleteHunt(hunt.id)
            .then(() => {
                setModal(false)
            })
            .then(() => {
                history.push("/home")
            })
    }

    return (
        <Modal open={modal}
            onCancel={(e, dialog) => {
                e.preventDefault()
            }}
            onClose={(e, dialog) => {
                setModal(false)
                const value = dialog.returnValue
                //if (value) alert(`You answered "${dialog.returnValue}" to the modal`)
            }}
        >
            <h2>Delete Hunt <br /> Are Your Sure?</h2>
            <button id="deleteConfirmButton"
                onClick={deleteHunt}>
                Yes
            </button>
            <button id="doNotDeleteButton"
                onClick={() => setModal(false)}>
                No
            </button>
        </Modal>
    )
}