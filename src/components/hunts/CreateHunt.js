import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import checkUser from "../../hooks/checkUser";
import ClueRepository from "../../repositories/ClueRepository";
import HuntRepository from "../../repositories/HuntRepository";
import UserHuntRepository from "../../repositories/UserHuntRepository";
import UserRepository from "../../repositories/UserRepository";
import { HunterInvite } from "../dialog/HunterInvite"
import { ClueForm } from "./ClueForm"
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

    const saveHunt = () => {
        // check if valid entries
        // hunt title // has reward text
        const huntCheck = newHunt.title && newHunt.rewardText
        // clue has hint // clue has answer // clue has type
        const clueCheck = cluesToAdd.reduce((returnValue, currentClue) => {
            const clueReduceCheck = currentClue.clueAnswer && currentClue.clueText && currentClue.clueType
            return clueReduceCheck || returnValue
        }, true)
        // has huntId // has userId // has stepsCompleted = 0
        const userHuntCheck = userHuntsToAdd.reduce((returnValue, currentUH) => {
            const uhReduceCheck = currentUH.stepsCompleted === 0 && currentUH.userId
            return uhReduceCheck || returnValue
        }, true)
        if(huntCheck && clueCheck && userHuntCheck) {
            // add userId to hunt
            newHunt.userId = parseInt(getCurrentUser())
            // add hunt to hunt database
            let addedHuntId = 0
            HuntRepository.addHunt(newHunt)
                .then((addedHunt) => {
                    addedHuntId = addedHunt.id
                    // add huntId to clues
                    return cluesToAdd.map((clue, index) => {
                        const copy = {...clue}
                        copy.huntId = addedHuntId
                        copy.clueIndex = index + 1
                        return copy
                    })
                })
                .then(cluesWithData => {
                    for (const clue of cluesWithData) {
                        ClueRepository.addClue(clue)
                    }
                })
                .then(() => {
                    return userHuntsToAdd.map(uh => {
                        const copy = {...uh}
                        copy.huntId = addedHuntId
                        return copy
                    })
                })
                .then(userHuntsWithData => {
                    for (const userHunt of userHuntsWithData) {
                        UserHuntRepository.sendUserHunt(userHunt)
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
        <main className="creatHunt">

            <h2>Create New Hunt</h2>
            <form className="newHuntForm">
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="title">Hunt Title: </label>
                        <input
                            required autoFocus
                            type="text"
                            id="title"
                            className="form-control"
                            placeholder="Add Hunt Title"
                            onChange={handleFormInput} />
                    </div>
                </fieldset>
                <ClueForm cluesToAdd={cluesToAdd} setCluesToAdd={setCluesToAdd} editingClue={editingClue} setEditing={setEditing} />
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
            </form>
            <div className="hunters">
                <h3>Hunters</h3>
                <div className="inviteeList">
                    {
                        users.map(user => {
                            const foundUser = userHuntsToAdd.find(uh => uh.userId === user.id)
                            if (foundUser) {
                                return <div>{user.name}</div>
                            }
                        })
                    }
                </div>
            </div>
            <div className="createHuntButtons">
                <HunterInvite hunt={{ id: -1 }} userHunts={userHuntsToAdd} setUserHunts={setUserHuntsToAdd} />
                <button className="saveHuntButton" onClick={saveHunt}>Save Hunt</button>

            </div>
        </main>
    </>
}