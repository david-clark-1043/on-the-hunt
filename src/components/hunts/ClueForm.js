import { useEffect, useState } from "react"
import ClueTypeRepository from "../../repositories/ClueTypeRepository"


export const ClueForm = ({ cluesToAdd, setCluesToAdd, editingClue, setEditing }) => {
    const [currentClue, setCurrentClue] = useState({ clueTypeId: 0 })
    const [editIndex, setEditIndex] = useState(-1)
    const [clueTypes, setClueTypes] = useState([])

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
            copy[property] = event.target.value
        }
        setCurrentClue(copy)
    }

    const saveStep = (event) => {
        event.preventDefault()
        if (currentClue.clueText && currentClue.clueTypeId && currentClue.clueAnswer) {
            const copyClues = JSON.parse(JSON.stringify(cluesToAdd))
            if (editIndex >= 0) {
                copyClues[editIndex] = currentClue
                setEditIndex(-1)
            } else {
                if (copyClues.length > 1) {
                    copyClues.push(currentClue)
                } else if (copyClues[0].clueText) {
                    copyClues.push(currentClue)
                } else {
                    copyClues[0] = currentClue
                }
            }
            setCluesToAdd(copyClues)
            setEditing(!editingClue)
            setCurrentClue({ clueTypeId: 0 })
        }
    }

    const handleEdit = (event) => {
        event.preventDefault()
        const newIndex = parseInt(event.target.id)
        setEditIndex(newIndex)
        setCurrentClue(cluesToAdd[newIndex])
        setEditing(!editingClue)
    }

    const handleDelete = (event) => {
        event.preventDefault()
        const deleteIndex = parseInt(event.target.id)
        const copyClues = JSON.parse(JSON.stringify(cluesToAdd))
        const deletedArry = copyClues.map((clue, index) => {
            if (index != deleteIndex) {
                return clue
            }
        })
        setCluesToAdd(deletedArry)
    }

    return (
        <>
            {editingClue
                ? <>
                    <div className="editingClue">
                    
                    <div>Editing Clue</div>
                        <fieldset>
                            <div className="clueText">
                                <label htmlFor="clueText">Clue Hint: </label>
                                <input
                                    required autoFocus
                                    type="text"
                                    id="clueText"
                                    className="form-control"
                                    // placeholder="Add Hint"
                                    defaultValue={currentClue.clueText}
                                    onChange={handleClueInput} />
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className="clueType">
                                Choose Clue type
                                {
                                    clueTypes.map(type => {
                                        return <div className="typeInput">
                                            <input type="radio"
                                                key={`type--${type.id}`}
                                                name="clueType"
                                                id="clueTypeId"
                                                value={`${type.id}`}
                                                onChange={(e) => handleClueInput(e, true)}
                                                checked={currentClue.clueTypeId === type.id} />
                                            {type.type}
                                        </div>
                                    })
                                }
                            </div>
                        </fieldset>
                        {currentClue.clueTypeId
                            ? <fieldset>
                                <label htmlFor="clueAnswer">Clue Answer: </label>
                                <input
                                    required autoFocus
                                    type="text"
                                    id="clueAnswer"
                                    className="form-control"
                                    defaultValue={currentClue.clueAnswer}
                                    onChange={handleClueInput} />
                            </fieldset>
                            : null
                        }
                        <div className="buttonControls">
                            <button className="saveStep" onClick={saveStep}>Save step</button>
                            <button className="clueBack"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setEditing(!editingClue)
                                }
                                }>
                                Back
                            </button>
                        </div>
                    </div>
                </>
                : <>
                    <h2>Clues</h2>
                    <div className="clueList">
                        {cluesToAdd.map((clue, index) => {
                            if (clue.clueText) {
                                return <div className="singleClue" key={`clue--${index}`}>
                                    <div className="clueListing">
                                        <div>Clue {index + 1}</div>
                                        <div>{clue.clueText}</div>
                                    </div>
                                    <button className="editClue" id={`${index}`} onClick={handleEdit}>Edit</button>
                                    <button className="deleteClue" id={`${index}`} onClick={handleDelete}>Delete</button>
                                </div>
                            }
                        })}
                        <button className="addStep" onClick={addStep}>Add step</button>

                    </div>
                </>
            }
        </>
    )
}