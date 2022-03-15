import { InviteDialog } from "./InviteDialog"
import { Modal } from 'react-dialog-polyfill'
import { useState } from "react"


export const HunterInvite = ({hunt, userHunts, setUserHunts }) => {
    const [modal, setModal] = useState(false)

    return <>
    <Modal open={modal}
        onCancel={(e, dialog) => {
          setModal(false)
          alert('You canceled the modal')
        }}
        onClose={(e, dialog) => {
          setModal(false)
        }}
      >
        <InviteDialog toggleDialog={setModal} hunt={hunt} userHunts={userHunts} setUserHunts={setUserHunts}/>
      </Modal>
        <button onClick={() => setModal(true)}>Hunter Invite</button>
    </>
}