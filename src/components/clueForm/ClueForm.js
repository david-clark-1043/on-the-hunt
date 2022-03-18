import { useEffect, useState } from "react"
import ClueTypeRepository from "../../repositories/ClueTypeRepository"
import { ClueEditing } from "./EditingClue"



export const ClueForm = ({ cluesToAdd, setCluesToAdd, editingClue, setEditing }) => {
    const [currentClue, setCurrentClue] = useState({ clueTypeId: 0 })
    const [editIndex, setEditIndex] = useState(-1)
    const [clueTypes, setClueTypes] = useState([])
    const [clueList, setClueJSX] = useState(<div></div>)

    useEffect(
        () => {
            ClueTypeRepository.getAll()
                .then(setClueTypes)
        }, []
    )

    const addStep = () => {
        // const copyClues = cluesToAdd.map(clue => ({...clue}))
        // copyClues.push({id: copyClues.length})
        // setCluesToAdd(copyClues)
        setEditing(!editingClue)
    }

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

    const saveStep = (event) => {
        event.preventDefault()
        let clueAnswerCheck = false
        if (currentClue.clueTypeId && currentClue.clueTypeId === 2) {
            clueAnswerCheck = true
        } else if (currentClue.clueTypeId && currentClue.lat) {
            clueAnswerCheck = true
        }
        if (currentClue.clueText &&
            currentClue.clueTypeId &&
            clueAnswerCheck) {
            const copyClues = JSON.parse(JSON.stringify(cluesToAdd))
            if (editIndex >= 0) {
                copyClues[editIndex] = currentClue
                setEditIndex(-1)
            } else {
                if (copyClues[0] && copyClues.length > 1) {
                    currentClue.clueIndex = copyClues.length + 1
                    copyClues.push(currentClue)
                } else if (copyClues[0]?.clueText) {
                    currentClue.clueIndex = copyClues.length + 1
                    copyClues.push(currentClue)
                } else {
                    currentClue.clueIndex = 1
                    copyClues[0] = currentClue
                }
            }
            setCluesToAdd(copyClues)
            setEditing(!editingClue)
            setCurrentClue({ clueTypeId: 0 })
        } else {
            window.alert("clue info error")
        }
    }

    const handleEdit = (event) => {
        event.preventDefault()
        const newIndex = parseInt(event.target.id.split("--")[1])
        setEditIndex(newIndex)
        setCurrentClue(cluesToAdd[newIndex])
        setEditing(!editingClue)
    }

    const handleDelete = (event) => {
        event.preventDefault()
        const deleteIndex = parseInt(event.target.id.split("--")[1])
        const copyClues = JSON.parse(JSON.stringify(cluesToAdd))
        const deletedArry = copyClues.filter((clue, index) => {
            if (index != deleteIndex) {
                return clue
            }
        })
        setCluesToAdd(deletedArry)
    }

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
                if (event.target.className.includes("singleStep")) {
                    const el = event.target
                    el.classList.remove("over")
                }
                const targetId = parseInt(event.currentTarget.id.split("--")[1])
                const draggedClue = JSON.parse(event.dataTransfer.getData("clue"))
                const draggedDiv = document.querySelector(`#clue--${draggedClue.clueIndex}`)
                setTimeout(() => {
                    draggedDiv.classList.remove("hide")
                })
                const copy = cluesToAdd.map(clue => ({ ...clue }))
                const targetClue = JSON.parse(JSON.stringify(copy.find(clue => clue.clueIndex === targetId)))

                const draggedIndex = draggedClue.clueIndex
                const targetIndex = targetClue.clueIndex
                // goal: get draggedClue where targetClue is located
                //  update in between clues to new index values
                // if target === dragged clue do nothing
                if (targetClue.clueIndex !== draggedClue.clueIndex) {
                    // make draggedClue's index = targetClue's index
                    draggedClue.clueIndex = targetIndex
                    // get clue array w/o draggedClue
                    const filteredClues = copy.filter(clue => clue.clueIndex !== draggedIndex)
                    // iterate over new arry
                    if (draggedIndex > targetIndex) {
                        for (const clue of filteredClues) {
                            // if clueIndex is >= targetClue and < draggedClue
                            if (clue.clueIndex >= targetIndex &&
                                clue.clueIndex < draggedIndex) {
                                // increment clueIndex
                                clue.clueIndex++
                            }
                            // else do nothing
                        }
                    } else {
                        // if target is greater than dragged clue index
                        for (const clue of filteredClues) {
                            if (clue.clueIndex <= targetIndex &&
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
                    setCluesToAdd(filteredClues)
                    // set as cluearray
                }
            }

            const handleEnter = (event) => {
                event.preventDefault()
                if (event.target.className.includes("singleStep")) {
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
                if (event.relatedTarget.className.includes("clueList") ||
                    event.relatedTarget.className.includes("newHuntForm")) {
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

                if (event.target.className.includes("hide")) {
                    const el = event.target
                    el.classList.remove("hide")
                }
            }

            if (editingClue) {
                const clueJSX = [<ClueEditing
                    key={"clue--0"}
                    currentClue={currentClue}
                    setCurrentClue={setCurrentClue}
                    handleClueInput={handleClueInput}
                    clueTypes={clueTypes}
                    editingClue={editingClue}
                    setEditing={setEditing}
                    saveStep={saveStep}
                />]
                setClueJSX(clueJSX)
            } else {
                const clueJSX = cluesToAdd.map((clue, index) => {
                    if (clue.clueText) {
                        return <div className="singleStep"
                            key={`clue--${index}`}
                            id={`clue--${clue.clueIndex}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, clue)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, "pending")}
                            onDragEnter={(e) => handleEnter(e)}
                            //onDragOver={(e) => handleOver(e)}
                            onDragLeave={(e) => handleLeave(e)}
                            onDragEnd={(e) => handleEnd(e)}
                            >
                            <div className="clueListing">
                                <div>Clue {index + 1}</div>
                                <div>Hint: {clue.clueText}</div>
                                <hr />
                                <div>Answer: {clue.clueAnswer}</div>
                            </div>
                            <div className="clueButtons">
                                <button className="editClue" id={`edit--${index}`} onClick={handleEdit}>Edit</button>
                                <button className="deleteClue" id={`delete--${index}`} onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    }
                })
                setClueJSX(clueJSX)
            }
        }, [editingClue, currentClue, cluesToAdd]
    )

    return (
        <>
            <h3>Clues</h3>
            <div className="clueList">
                {clueList}
            </div>
            {
                editingClue
                    ? null
                    : <button className="addStep" onClick={addStep}>Add step</button>
            }
        </>
    )
}