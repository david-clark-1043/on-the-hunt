import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "./HuntParticipant.css"

export const HuntParticipant = (props) => {
    const [currentClue, setCurrentclue] = useState({})
    const [completedClues, setCompletedClues] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            let stepIndex = props.userHunt?.stepsCompleted
            let sliceIndex = stepIndex
            if (stepIndex > props.clues.length - 1) {
                stepIndex = props.clues.length - 1
                sliceIndex = stepIndex + 1
            }
            const clue = props.clues[stepIndex]
            const completes = props.clues.slice(0, sliceIndex)
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
                                    <h3 className="currentStepTitle">Clue {props.clues?.findIndex(clue => clue.id === currentClue?.id) + 1} of {props.clues.length}</h3>
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
                            completedClues.map((compClue, index) => {
                                return <div className="completedClueListing" key={`completedClue--${compClue.id}`}>
                                    <div>Clue {index + 1}</div>
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