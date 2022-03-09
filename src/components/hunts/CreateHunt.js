import { useEffect, useState } from "react"
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
    const [userHuntsToAdd, setUserHuntsToAdd] = useState([{userId:0}])
    const [hunters, setHunters] = useState([])

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

    return <>
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
                        required autoFocus
                        type="text"
                        id="rewardText"
                        className="form-control"
                        placeholder="Add Reward Text"
                        onChange={handleFormInput} />
                </div>
            </fieldset>
        </form>
        <div className="inviteeList">
            {
                users.map(user => {
                    const foundUser = userHuntsToAdd.find(uh => uh.userId === user.id)
                    if(foundUser) {
                        return <div>{user.name}</div>
                    }
                })
            }
        </div>
        <HunterInvite hunt={{id: -1}} userHunts={userHuntsToAdd} setUserHunts={setUserHuntsToAdd} />
        <div className="saveHunt">Save Hunt</div>
    </>
}