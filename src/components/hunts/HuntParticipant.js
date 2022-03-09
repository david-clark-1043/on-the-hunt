import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "./HuntParticipant.css"

export const HuntParticipant = (props) => {
    const [currentClue, setCurrentclue] = useState({})
    const [completedClues, setCompletedClues] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            const stepIndex = props.userHunt?.stepsCompleted
            const clue = props.clues[stepIndex]
            const completes = props.clues.slice(0, stepIndex)
            setCompletedClues(completes)
            setCurrentclue(clue)
        }, [props.userHunt, props.clues]
    )

    return <>
        <main className="clueContainer">
            <div className="clueBox">
                <div>
                    <div>
                    <h2>Scavenger Hunt: {props.hunt.title}</h2>
                    <button onClick={() => history.goBack()}>Back</button>
                    </div>
                    <div className="currentStepBox">
                        {
                            props.userHunt?.stepsCompleted >= props.clues?.length
                                ? <div className="huntCompleteBox">
                                    <div>Hunt Complete!</div>
                                    <div>{props.hunt.rewardText}</div>
                                </div>
                                : <div>
                                    <h3 className="currentStepTitle">Clue {currentClue?.clueIndex} of {props.clues.length}</h3>
                                    <div className="currentClueType">
                                        Category: {currentClue?.clueType?.type} Clue
                                    </div>
                                    <div className="currentClueText">
                                        {currentClue?.clueText}
                                    </div>

                                </div>
                        }
                    </div>
                    <div className="compeletedStepsBox">
                        <h3>Completed Clues</h3>
                        {
                            completedClues.map(compClue => {
                                return <div className="completedClueListing">
                                    <div>Clue {compClue.clueIndex}</div>
                                    <div>{compClue.clueText}</div>
                                    <div>{compClue.clueAnswer}</div>
                                    </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </main>
    </>
}