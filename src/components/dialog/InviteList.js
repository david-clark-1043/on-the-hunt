import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import UserRepository from "../../repositories/UserRepository"
import "./InviteList.css"

export const InviteList = ({ toggleDialog, searchInput, hunt, userHunts, setUserHunts }) => {
    const [users, setUsers] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            UserRepository.getAll()
                .then((userArray) => {
                    setUsers(userArray)
                })
        },
        []
    )

    const selectUser = (event) => {
        const newUserHunt = {
            huntId: parseInt(hunt.id),
            userId: parseInt(event.target.id.split("--")[1]),
            stepsCompleted: 0
        }
        //setPurchase(copy)
        const checkHunt = userHunts.find(uh => uh.userId === newUserHunt.userId && uh.huntId === newUserHunt.huntId)
        if(checkHunt) {
            window.alert("User already on this hunt.")
        } else {
            return UserHuntRepository.sendUserHunt(newUserHunt)
                .then(() => UserHuntRepository.getAll())
                .then(setUserHunts)
                .then(() => {
                    // toggleDialog()
                    // history.push(`/hunts/${huntId}`)
                })
        }
    }

    return (
        <>
            <div className="inviteList">
                {users.map(user => {
                    const userName = user.name.toLowerCase()
                    const inputLower = searchInput.toLowerCase()
                    if (userName.includes(inputLower)) {
                        return (<div key={`user--${user.id}`} className="userListing">
                            <div>{user.name}</div>
                            <button
                                id={`inviteButton--${user.id}`}
                                onClick={selectUser}
                            >
                                Invite
                            </button>
                        </div>)
                    }
                })}
            </div>
            
        </>
    )
}