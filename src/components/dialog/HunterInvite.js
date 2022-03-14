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
          const value = dialog.returnValue
          if (value) alert(`You answered "${dialog.returnValue}" to the modal`)
        }}
      >
        <InviteDialog toggleDialog={setModal} hunt={hunt} userHunts={userHunts} setUserHunts={setUserHunts}/>
      </Modal>
        <button onClick={() => setModal(true)}>Hunter Invite</button>
    </>
}