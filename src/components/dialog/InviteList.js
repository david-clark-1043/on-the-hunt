import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import UserRepository from "../../repositories/UserRepository"
import "./InviteList.css"

export const InviteList = ({ toggleDialog, searchInput, hunt, userHunts, setUserHunts }) => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
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

    useEffect(
        () => {
            if(searchInput) {
                const filter = users.filter(user => {
                    const userName = user.name.toLowerCase()
                    const inputLower = searchInput.toLowerCase()
                    return userName.includes(inputLower)
                })
                setFilteredUsers(filter)
            } else {
                setFilteredUsers([])
            }
        }, [users, searchInput]
    )

    const selectUser = (event) => {
        let newUserHunt = {}
        if (hunt.id === -1) {
            newUserHunt = {
                userId: parseInt(event.target.id.split("--")[1]),
                stepsCompleted: 0
            }
            const copyUserHunts = JSON.parse(JSON.stringify(userHunts))
            const checkHunt = copyUserHunts.find(uh => uh.userId === newUserHunt.userId)
            if (checkHunt) {
                window.alert("User already selected.")
            } else {
                if (copyUserHunts.length > 1) {
                    copyUserHunts.push(newUserHunt)
                } else if (copyUserHunts[0].userId) {
                    copyUserHunts.push(newUserHunt)
                } else {
                    copyUserHunts[0] = newUserHunt
                }
                setUserHunts(copyUserHunts)
            }
        } else {
            newUserHunt = {
                huntId: parseInt(hunt.id),
                userId: parseInt(event.target.id.split("--")[1]),
                stepsCompleted: 0
            }
            const checkHunt = userHunts.find(uh => uh.userId === newUserHunt.userId && uh.huntId === newUserHunt.huntId)
            if (checkHunt) {
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
        //setPurchase(copy)
    }

    return (
        <>
            <div className="inviteList">
                {filteredUsers.map(user => {
                    return (<div key={`user--${user.id}`} className="userListing">
                        <div><div>{user.name}</div></div>
                        <button
                            id={`inviteButton--${user.id}`}
                            onClick={selectUser}
                        >
                            Invite
                        </button>
                    </div>)
                })}
            </div>

        </>
    )
}