import useModal from "../../hooks/useModal"
import { InviteDialog } from "./InviteDialog"

export const HunterInvite = ({hunt, userHunts, setUserHunts }) => {
    const { toggleDialog, modalIsOpen } = useModal("#dialog--invite")

    return <>
        <InviteDialog toggleDialog={toggleDialog} hunt={hunt} userHunts={userHunts} setUserHunts={setUserHunts}/>
        <button onClick={toggleDialog}>Hunter Invite</button>
    </>
}