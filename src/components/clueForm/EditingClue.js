
export const ClueEditing = ({ currentClue, handleClueInput, clueTypes, editingClue, setEditing, saveStep }) => {
    // currentClue - state object
    // handleClueInput - function
    // clueTypes - state value
    // editingClue - state value
    // setEditing - state function

    // saveStep - function
    return <>
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
                            return <div className="typeInput" key={`type-${type.id}`}>
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
}