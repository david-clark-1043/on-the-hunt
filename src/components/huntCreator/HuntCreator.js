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
    const [currentUserHunts, setCurrentUserHunts] = useState([])
    const [clueJSX, setClueJSX] = useState([])
    const [deleteModal, toggleDeleteModal] = useState(false)
    const history = useHistory()

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

    useEffect(
        () => {
            if (props.userHunts) {
                const filteredHunts = props.userHunts.filter(uh => {
                    return uh.user && uh.huntId === props.hunt.id
                })
                    .map(uh => {
                        return <div className="hunterStatus" key={`hunterStatus--${uh.id}`}>
                            <div>
                                <div>{uh.user.name}</div>
                            </div>
                            <div>
                                <div>Steps completed {uh.stepsCompleted > props.clues.length ? props.clues.length : uh.stepsCompleted}</div>
                            </div>
                            <button className="checkProgressButton"
                                id={`userHunt--${uh.huntId}--${uh.userId}`}
                                onClick={checkProgressNav}>Check Progress</button>
                        </div>
                    })
                if (typeof filteredHunts[0] === 'object') {
                    setCurrentUserHunts(filteredHunts)
                } else {
                    setCurrentUserHunts([<div>No users hunting this scavenger hunt.</div>])
                }
            }
        }, [props]
    )

    useEffect(
        () => {
            if (editingClue) {
                const clueJS = [<ClueEditing
                    currentClue={currentClue}
                    setCurrentClue={setCurrentClue}
                    handleClueInput={handleClueInput}
                    clueTypes={clueTypes}
                    editingClue={editingClue}
                    setEditing={setEditing}
                    saveStep={saveStep} />]
                setClueJSX(clueJS)
            } else {
                if (props.clues) {
                    const clueJS = props.clues.map((clue, index) => {
                        return <section className="singleStep" key={`clue--${clue.id}`}>
                            <div className="stepInfo">
                                <div className="clueStats">
                                    <div>Clue {index + 1}</div>
                                    <div>{clue.clueType?.type} clue</div>
                                </div>
                                <div className="clueText">Hint: {clue.clueText}</div>
                                <div className="clueAnswer">Answer: {clue.clueAnswer}</div>
                            </div>
                            <div className="stepButtons">
                                <button className="stepEdit" id={`${clue.id}`} onClick={openEditor}>
                                    Edit
                                </button>
                                <button className="stepDelete" id={`${clue.id}`} onClick={deleteClue}>
                                    Delete
                                </button>
                            </div>
                        </section>
                    })
                    setClueJSX(clueJS)
                }
            }
        }, [props, editingClue]
    )

    useEffect(
        () => {
            const userHuntCheck = typeof currentUserHunts[0] === 'object'
            const clueCheck = typeof clueJSX[0] === 'object'
            if (userHuntCheck && clueCheck) {
                props.setLoading(false)
            }
        }, [currentUserHunts, clueJSX]
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
        if(props.clues.length === 1) {
            window.alert("You can't delete the last clue. Delete the hunt if you would like to remove it.")
        } else {
            const copyClues = props.clues.map(clue => ({ ...clue }))
            const clue = copyClues.find(c => c.id === parseInt(event.target.id))
            ClueRepository.deleteClue(clue)
                .then(() => {
                    return ClueRepository.getCluesForHunt(props.hunt.id)
                })
                .then(props.setClues)
        }
    }

    return (
        <>
            <main className="mainContainer">

                <div className="huntBox">
                    <div>
                        <div className="header">
                            <h2>{props.hunt.title}</h2>
                            <button onClick={() => history.goBack()}>Back</button>
                        </div>
                        <h3>Clues</h3>
                        <article className="stepList">
                            {clueJSX}
                        </article>
                    </div>
                    <div>
                        <h3>Hunters</h3>
                        <article className="hunterList">
                            {currentUserHunts}
                        </article>
                    </div>
                    <div>
                        <HunterInvite hunt={props.hunt} userHunts={props.userHunts} setUserHunts={props.setUserHunts} />
                        <ConfirmDelete modal={deleteModal} setModal={toggleDeleteModal} hunt={props.hunt} />
                        <button onClick={() => toggleDeleteModal(true)}>Delete Hunt</button>
                    </div>

                </div>
                {/* <button className="newHuntButton" onClick={newHuntNavigate}>New Hunt</button> */}
            </main>
        </>
    )
}