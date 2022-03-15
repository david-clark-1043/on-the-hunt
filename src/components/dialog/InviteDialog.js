import { useState } from "react"
import { InviteList } from "./InviteList"
import { InviteSearch } from "./InviteSearch"

export const InviteDialog = ({toggleDialog, hunt, userHunts, setUserHunts}) => {
    const [searchInput, setSearchInput] = useState("")

    return (
        <>
        {/* <dialog id="dialog--invite" className="dialog--invite"> */}
            <h2>Invite User</h2>
            <InviteSearch  setSearchInput={setSearchInput} />
            <InviteList toggleDialog={toggleDialog} 
                searchInput={searchInput} 
                hunt={hunt} 
                userHunts={userHunts} 
                setUserHunts={setUserHunts} />
            <button id="closeBtn"
                onClick={() => toggleDialog(false)}>
                Close
            </button>
        {/* </dialog> */}
        </>
    )
}