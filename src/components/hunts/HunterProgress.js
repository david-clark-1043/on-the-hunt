import { useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import ClueRepository from "../../repositories/ClueRepository"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import "./HunterProgress.css";

export const HunterProgress = () => {
    const [loading, setLoading] = useState(true)
    const [clues, setClues] = useState([])
    const { hunt } = useLocation().state
    const [userHunt, setUserHunt] = useState({ stepsCompleted: 0 })
    const [currentClue, setClue] = useState({})
    const [stepJSX, setStepJSX] = useState([])
    const [progressJSX, setProgressJSX] = useState([])
    const { huntId, userId } = useParams()
    const history = useHistory()


    useEffect(
        () => {
            UserHuntRepository.getAll()
                .then((fetchedUH) => {
                    const foundUH = fetchedUH.find(uh => {
                        return uh.huntId === parseInt(huntId) && uh.userId === parseInt(userId)
                    })
                    if (foundUH) {
                        setUserHunt(foundUH)
                    }
                })
                .then(() => {
                    return ClueRepository.getCluesForHunt(huntId)
                })
                .then(setClues)
        }, [huntId, userId]
    )

    useEffect(
        () => {
            if (typeof clues[0] === "object") {
                if (userHunt.stepsCompleted > clues.length - 1) {
                    setClue(clues[clues.length - 1])
                } else {
                    setClue(clues[userHunt.stepsCompleted])
                }
            }
        }, [userHunt, clues]
    )

    useEffect(
        () => {

            const unlockClue = () => {
                const copy = JSON.parse(JSON.stringify(userHunt))
                copy.stepsCompleted++
                delete copy.user
                delete copy.hunt
                UserHuntRepository.updateUserHunt(copy)
                    .then(res => UserHuntRepository.get(res.id))
                    .then((resUserHunt) => {
                        setUserHunt(resUserHunt)
                        if (resUserHunt.stepsCompleted > clues.length - 1) {
                            setClue(clues[clues.length - 1])
                        } else {
                            setClue(clues[resUserHunt.stepsCompleted])
                        }
                    })
            }

            if ("id" in currentClue) {
                if (clues.length > userHunt.stepsCompleted) {
                    const stepJS = [
                        <div key={"currentStep"} className="currentStepProg">
                            <div className="currentClueInfo">
                                <div className="stepNum">
                                    Current Clue: {clues.findIndex(clue => clue.id === currentClue?.id) + 1} of {clues.length}
                                </div>
                                <div className="clueText">
                                    Hint: {currentClue.clueText}
                                </div>
                                <div className="clueAnswer">
                                    Answer: {currentClue.clueAnswer}
                                </div>
                            </div>
                            <button className="unlockClue" onClick={unlockClue}>
                                Unlock Next Clue
                            </button>
                        </div>
                    ]
                    setStepJSX(stepJS)
                } else {
                    const stepJS = [<div key={"currentStep"}>
                        <div>Hunt Complete!</div>
                        <div>Message Sent: {hunt.rewardText}</div>
                        <div className="compeletedStepsBox">
                            <h3>Completed Clues</h3>
                            {
                                clues.map((compClue, index) => {
                                    return <div className="completedClueListing" key={`completedClue--${compClue.id}`}>
                                        <div>Clue {index + 1}</div>
                                        <div>Hint: {compClue.clueText}</div>
                                        <div>Answer: {compClue.clueAnswer}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>]
                    setStepJSX(stepJS)
                }
            }
        }, [userHunt, clues, currentClue]
    )

    useEffect(
        () => {

            const removeHunter = () => {
                UserHuntRepository.deleteUserHunt(userHunt)
                    .then(() => history.push(`/hunts/${hunt.id}`))
            }

            if (typeof stepJSX[0] === 'object') {
                const progJSX = [<div key={"title"}>
                    <div className="header">
                        <h2 className="huntTitle">{hunt.title}</h2>
                        <button className="backButton" onClick={() => history.goBack()}>Back</button>
                    </div>
                    <h3 className="hunterName">Hunter: {userHunt.user?.name}</h3>
                    <div>
                        {stepJSX}
                    </div>
                    <div className="removeHunter">
                        <button className="removeHunterButton"
                            onClick={removeHunter}>
                            Remove Hunter
                        </button>
                    </div>
                </div>
                ]
                setProgressJSX(progJSX)
            }
        }, [stepJSX, userHunt]
    )

    useEffect(
        () => {
            if (typeof progressJSX[0] === 'object') {
                setLoading(false)
            }
        }, [progressJSX]
    )





    return <>
        <div key={"loading"} className="loading" style={{ visibility: loading ? "visible" : "hidden" }}>
            Loading...
        </div>
        <div key={"hunterprog"} className="hunterProgBox" style={{ visibility: loading ? "hidden" : "visible" }}>
            {progressJSX}
        </div>
    </>
}