import { useHistory } from "react-router-dom"
import "./HuntCreator.css";
import { HunterInvite } from "../dialog/HunterInvite";
import useModal from "../../hooks/useModal";
import { ConfirmDelete } from "../dialog/ConfirmDelete";
import { useEffect, useState } from "react";
import { ClueEditing } from "../clueForm/EditingClue";
import ClueTypeRepository from "../../repositories/ClueTypeRepository";
import ClueRepository from "../../repositories/ClueRepository";

export const HuntCreator = (props) => {
    const [editingClue, setEditing] = useState(false)
    const [currentClue, setCurrentClue] = useState({})
    const history = useHistory()
    const { toggleDialog: toggleDeleteDialog, modalIsOpen: deleteIsOpen } = useModal("#dialog--delete")

    const [clueTypes, setClueTypes] = useState([])

    useEffect(
        () => {
            ClueTypeRepository.getAll()
                .then(setClueTypes)
        }, []
    )

    useEffect(
        () => {
            if (currentClue?.clueText && !editingClue) {
                setEditing(!editingClue)
            }
        }, [currentClue]
    )

    const handleClueInput = (event, parse = false) => {
        const copy = JSON.parse(JSON.stringify(currentClue))
        const property = event.target.id
        if (parse) {
            copy[property] = parseInt(event.target.value)
        } else {
            event.preventDefault()
            copy[property] = event.target.value
        }
        setCurrentClue(copy)
    }

    const checkProgressNav = (event) => {
        const [, huntProgId, userProgId] = event.target.id.split("--")
        const copy = JSON.parse(JSON.stringify(props))
        history.push(`/hunts/${huntProgId}/progress/${userProgId}`, copy)
    }

    const openEditor = (event) => {
        const copyClues = props.clues.map(clue => ({ ...clue }))
        const clue = copyClues.find(c => c.id === parseInt(event.target.id))
        setCurrentClue(clue)

    }

    const saveStep = () => {
        const updatedClue = JSON.parse(JSON.stringify(currentClue))
        delete updatedClue.clueType
        ClueRepository.updateClue(updatedClue)
            .then(() => {
                return ClueRepository.getCluesForHunt(props.hunt.id)
            })
            .then(props.setClues)
            .then(() => setCurrentClue({}))
            .then(setEditing(false))
    }

    const deleteClue = (event) => {
        const copyClues = props.clues.map(clue => ({ ...clue }))
        const clue = copyClues.find(c => c.id === parseInt(event.target.id))
        ClueRepository.deleteClue(clue)
            .then(() => {
                return ClueRepository.getCluesForHunt(props.hunt.id)
            })
            .then(props.setClues)
    }

    return (
        <>
            <main className="mainContainer">
                <div className="huntBox">
                    <div>
                        <h2>Scavenger Hunt: {props.hunt.title}</h2>
                        <h3>Clues</h3>
                        <article className="stepList">
                            {
                                editingClue
                                    ? <ClueEditing
                                        currentClue={currentClue}
                                        setCurrentClue={setCurrentClue}
                                        handleClueInput={handleClueInput}
                                        clueTypes={clueTypes}
                                        editingClue={editingClue}
                                        setEditing={setEditing}
                                        saveStep={saveStep} />
                                    : props.clues?.map((clue, index) => {
                                        return <section className="singleStep" key={`clue--${clue.id}`}>
                                            <div className="stepInfo">
                                                <div className="clueStats">
                                                    <div>Clue {index + 1}</div>
                                                    <div>{clue.clueType?.type} clue</div>
                                                </div>
                                                <div className="clueText">Clue Hint: {clue.clueText}</div>
                                                <div className="clueAnswer">Clue Answer: {clue.clueAnswer}</div>
                                            </div>
                                            <div className="stepButtons">
                                                <button className="stepEdit" id={`${clue.id}`} onClick={openEditor}>
                                                    Edit
                                                </button>
                                                <button className="stepDelete"id={`${clue.id}`} onClick={deleteClue}>
                                                    Delete
                                                </button>
                                            </div>
                                        </section>
                                    })}
                        </article>
                    </div>
                    <div>
                        <h3>Hunters</h3>
                        <article className="hunterList">
                            {props.userHunts?.map(uh => {
                                if (uh.user && uh.huntId === props.hunt.id) {
                                    return <div className="hunterStatus" key={`hunterStatus--${uh.id}`}>
                                        <div>{uh.user.name}</div>
                                        <div>Steps completed {uh.stepsCompleted > props.clues.length ? props.clues.length : uh.stepsCompleted}</div>
                                        <button className="checkProgressButton"
                                            id={`userHunt--${uh.huntId}--${uh.userId}`}
                                            onClick={checkProgressNav}>Check Progress</button>
                                    </div>
                                }
                            })}
                        </article>
                    </div>
                    <div>
                        <HunterInvite hunt={props.hunt} userHunts={props.userHunts} setUserHunts={props.setUserHunts} />
                        <ConfirmDelete toggleDeleteDialog={toggleDeleteDialog} hunt={props.hunt} />
                        <button onClick={toggleDeleteDialog}>Delete Hunt</button>
                    </div>

                </div>
                {/* <button className="newHuntButton" onClick={newHuntNavigate}>New Hunt</button> */}
            </main>
        </>
    )
}