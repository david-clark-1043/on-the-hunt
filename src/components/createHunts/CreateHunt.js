import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import checkUser from "../../hooks/checkUser";
import ClueRepository from "../../repositories/ClueRepository";
import HuntRepository from "../../repositories/HuntRepository";
import UserHuntRepository from "../../repositories/UserHuntRepository";
import UserRepository from "../../repositories/UserRepository";
import { HunterInvite } from "../dialog/HunterInvite"
import { ClueForm } from "../clueForm/ClueForm"
import "./CreateHunt.css";

export const CreateHunt = () => {
    const [users, setUsers] = useState([])
    const [newHunt, setNewHunt] = useState({})
    const [cluesToAdd, setCluesToAdd] = useState([{}])
    const [editingClue, setEditing] = useState(false)
    const [userHuntsToAdd, setUserHuntsToAdd] = useState([{ userId: 0 }])
    const { getCurrentUser } = checkUser()
    const history = useHistory()

    useEffect(
        () => {
            UserRepository.getAll()
                .then(setUsers)
        }, []
    )

    const handleFormInput = (event) => {
        const copy = JSON.parse(JSON.stringify(newHunt))
        const property = event.target.id
        copy[property] = event.target.value
        setNewHunt(copy)
    }

    const uninviteHunter = (event) => {
        const copy = userHuntsToAdd.map(userHunt => ({ ...userHunt }))
        const deletedArray = copy.filter(element => element.userId != parseInt(event.target.id))
        if (!(typeof deletedArray[0] === 'object')) {
            setUserHuntsToAdd([{ userId: 0 }])
        } else {
            setUserHuntsToAdd(deletedArray)
        }


    }

    const saveHunt = () => {
        // check if valid entries
        // hunt title // has reward text
        const huntCheck = newHunt.title && newHunt.rewardText
        // clue has hint // clue has answer // clue has type
        const clueCheck = cluesToAdd.reduce((returnValue, currentClue) => {
            const clueReduceCheck = currentClue.clueAnswer && currentClue.clueText && currentClue.clueTypeId
            if(!clueReduceCheck || returnValue === false) {
                return false
            } else {
                return true
            }
        }, true)
        // has huntId // has userId // has stepsCompleted = 0
        // only use if error with adding userHunts
        // const userHuntCheck = userHuntsToAdd.reduce((returnValue, currentUH) => {
        //     const uhReduceCheck = currentUH.stepsCompleted === 0 && currentUH.userId
        //     if(!uhReduceCheck || !returnValue) {
        //         return false
        //     } else {
        //         return true
        //     }
        // }, true)
        if (huntCheck && clueCheck /*&& userHuntCheck*/) {
            // add userId to hunt
            newHunt.userId = parseInt(getCurrentUser())
            // add hunt to hunt database
            let addedHuntId = 0
            HuntRepository.addHunt(newHunt)
                .then((addedHunt) => {
                    addedHuntId = addedHunt.id
                    // add huntId to clues
                    return cluesToAdd.map((clue, index) => {
                        const copy = { ...clue }
                        copy.huntId = addedHuntId
                        copy.clueIndex = index + 1
                        return copy
                    })
                })
                .then(cluesWithData => {
                    const arr = []
                    for (const clue of cluesWithData) {
                        arr.push(ClueRepository.addClue(clue))
                    }
                    return Promise.all(arr)
                })
                .then(() => {
                    return userHuntsToAdd.map(uh => {
                        const copy = { ...uh }
                        copy.huntId = addedHuntId
                        return copy
                    })
                })
                .then(userHuntsWithData => {
                    if(userHuntsWithData.length === 1 && userHuntsWithData[0].userId === 0) {
                        
                    } else {
                        const arr = []
                        for (const userHunt of userHuntsWithData) {
                            arr.push(UserHuntRepository.sendUserHunt(userHunt))
                        }
                        return Promise.all(arr)
                    }
                })
                .then(() => {
                    history.push("/home")
                })
            // add clues to clue database
            // add userHunts to userHunt database

        } else {
            window.alert("Hunt information incomplete.")
        }
    }

    return <>
        <main className="createHunt">

            <h2>Create New Hunt</h2>
            <form className="newHuntForm">
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="title">Hunt Title: </label>
                        <input
                            required
                            type="text"
                            id="title"
                            className="form-control"
                            placeholder="Add Hunt Title"
                            onChange={handleFormInput} />
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="rewardText">Reward Text: </label>
                        <input
                            required
                            type="text"
                            id="rewardText"
                            className="form-control"
                            placeholder="Add Reward Text"
                            onChange={handleFormInput} />
                    </div>
                </fieldset>
                <ClueForm cluesToAdd={cluesToAdd} setCluesToAdd={setCluesToAdd} editingClue={editingClue} setEditing={setEditing} />
            </form>
            <div className="hunters">
                <h3>Hunters</h3>
                <div className="inviteeList">
                    {
                        users.map(user => {
                            const foundUserHunt = userHuntsToAdd.find(uh => uh.userId === user.id)
                            if (foundUserHunt) {
                                return <div className="invitedHunter" key={`invitee--${foundUserHunt.userId}`}>
                                    <div><div>{user.name}</div></div>
                                    <button className="deleteInvite" id={`${foundUserHunt.userId}`} onClick={uninviteHunter}>Uninvite</button>
                                </div>
                            }
                        })
                    }
                </div>
            </div>
            <div className="createHuntButtons">
                <HunterInvite hunt={{ id: -1 }} userHunts={userHuntsToAdd} setUserHunts={setUserHuntsToAdd} />
            </div>
            <hr />
            <button className="saveHuntButton" onClick={saveHunt}>Save Hunt</button>
        </main>
    </>
}