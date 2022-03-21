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
                    setCurrentUserHunts([<div key={"hunter--0"}>No users hunting this scavenger hunt.</div>])
                }
            }
        }, [props]
    )



    useEffect(
        () => {
            /*
                handleDragStart adds the dragged clue to datatransfer and makes the clue semi transparent
            */
            const handleDragStart = (event, clue) => {
                event.dataTransfer.setData("clue", JSON.stringify(clue))

                //event.dataTransfer.setDragImage(dragImage, 0, 0)
                setTimeout(() => {
                    event.target.classList.add('hide');
                }, 0);
            }

            // stops handleDragOver from triggering
            const handleDragOver = (event) => {
                event.preventDefault()
            }

            const handleDrop = (event, status) => {
                if(event.target.className.includes("singleStep")) {
                    const el = event.target
                    el.classList.remove("over")
                }
                const targetId = parseInt(event.currentTarget.id.split("--")[1])
                const draggedClue = JSON.parse(event.dataTransfer.getData("clue"))
                const draggedDiv = document.querySelector(`#clue--${draggedClue.id}`)
                setTimeout(() => {
                    draggedDiv.classList.remove("hide")
                })
                const copy = props.clues.map(clue => ({...clue}))
                const targetClue = JSON.parse(JSON.stringify(copy.find(clue => clue.id === targetId)))

                const draggedIndex = draggedClue.clueIndex
                const targetIndex = targetClue.clueIndex
                // goal: get draggedClue where targetClue is located
                //  update in between clues to new index values
                // if target === dragged clue do nothing
                if(targetClue.id !== draggedClue.id) {
                    // make draggedClue's index = targetClue's index
                    draggedClue.clueIndex = targetIndex
                    // get clue array w/o draggedClue
                    const filteredClues = copy.filter(clue => clue.id !== draggedClue.id)
                    // iterate over new arry
                    if(draggedIndex > targetIndex) {
                        for (const clue of filteredClues) {
                            // if clueIndex is >= targetClue and < draggedClue
                            if(clue.clueIndex >= targetIndex && 
                                clue.clueIndex < draggedIndex) {
                                    // increment clueIndex
                                    clue.clueIndex++
                                }
                                // else do nothing
                        }
                    } else {
                        // if target is greater than dragged clue index
                        for (const clue of filteredClues) {
                            if(clue.clueIndex <= targetIndex && 
                                clue.clueIndex > draggedIndex) {
                                clue.clueIndex--
                            }
                        }
                    }
                    // add draggedClue back to array
                    filteredClues.push(draggedClue)                
                    // sort on clueIndex
                    filteredClues.sort((firstClue, secondClue) => firstClue.clueIndex - secondClue.clueIndex)
                    // send to database
                    let sendArr = []
                    for (const clue of filteredClues) {
                        delete clue.clueType
                        sendArr.push(ClueRepository.updateClue(clue))
                    }
                    Promise.all(sendArr)
                        .then(() => {
                            return ClueRepository.getCluesForHunt(props.hunt.id)
                        })
                        .then(props.setClues)
                    // set as cluearray
                }
            }

            const handleEnter = (event) => {
                event.preventDefault()
                if(event.target.className.includes("singleStep")) {
                    const overNodes = Array.from(document.querySelectorAll(".over"))
                    for (const node of overNodes) {
                        node.classList.remove("over")
                    }
                    const el = event.target
                    el.classList.add("over")
                }
            }

            const handleLeave = (event) => {
                event.preventDefault()
                if(event.relatedTarget.className.includes("stepList") ||
                    event.relatedTarget.className.includes("huntBox")) {
                    const el = event.target
                    el.classList.remove("over")
                }
            }

            const handleEnd = (event) => {
                event.preventDefault()
                const overNodes = Array.from(document.querySelectorAll(".over"))
                for (const node of overNodes) {
                    node.classList.remove("over")
                }

                if(event.target.className.includes("hide")) {
                    const el = event.target
                    el.classList.remove("hide")
                }
                
            }

            if (editingClue) {

            } else {
                if (props.clues) {
                    const clueJS = props.clues.map((clue, index) => {
                        return <section
                                    className="singleStep"
                                    key={`clue--${clue.id}`}
                                    id={`clue--${clue.id}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, clue)}
                                    onDragOver={(e) => handleDragOver(e)}
                                    onDrop={(e) => handleDrop(e, "pending")}
                                    onDragEnter={(e) => handleEnter(e)}
                                    //onDragOver={(e) => handleOver(e)}
                                    onDragLeave={(e) => handleLeave(e)}
                                    onDragEnd={(e) => handleEnd(e)}
                                    >
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
        if (props.clues.length === 1) {
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
                            {
                            editingClue
                            ?   <ClueEditing
                                key={"clueEdit--0"}
                                currentClue={currentClue}
                                setCurrentClue={setCurrentClue}
                                handleClueInput={handleClueInput}
                                clueTypes={clueTypes}
                                editingClue={editingClue}
                                setEditing={setEditing}
                                saveStep={saveStep} />
                            : clueJSX
                            }
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