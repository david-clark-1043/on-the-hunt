import { useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import UserHuntRepository from "../../repositories/UserHuntRepository"

export const HunterProgress = () => {
    const { clues, hunt } = useLocation().state
    const [userHunt, setUserHunt] = useState({ stepsCompleted: 0 })
    const [currentClue, setClue] = useState({})
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
                        setClue(clues[foundUH.stepsCompleted])
                    }
                })
        }
        , [huntId, userId]
    )

    const unlockClue = () => {
        const copy = JSON.parse(JSON.stringify(userHunt))
        copy.stepsCompleted++
        delete copy.user
        delete copy.hunt
        UserHuntRepository.sendUserHunt(copy)
            .then(res => UserHuntRepository.get(res.id))
            .then((resUserHunt) => {
                setUserHunt(resUserHunt)
                setClue(clues[resUserHunt.stepsCompleted])
            })
    }

    const removeHunter = () => {
        UserHuntRepository.deleteUserHunt(userHunt)
            .then(() => history.push(`/hunts/${hunt.id}`))
    }

    return <div>
        <h2 className="huntTitle">{hunt.title}</h2>
        <button className="backButton" onClick={() => history.goBack()}>Back</button>
        <h3 className="hunterName">Hunter: {userHunt.user?.name}</h3>
        <div>
            {clues.length > userHunt.stepsCompleted
                ? <div className="currentStep">
                    <div className="stepNum">
                        Current Clue: {currentClue.clueIndex}
                    </div>
                    <div className="clueText">
                        Hint: {currentClue.clueText}
                    </div>
                    <div className="clueAnswer">
                        Answer: {currentClue.clueAnswer}
                    </div>
                    <button className="unlockClue" onClick={unlockClue}>
                        Unlock Next Clue
                    </button>
                </div>
                : <div>
                    <div>Hunt Complete!</div>
                    <div>
                        {clues.map(clue => <div>
                            <div>Clue {clue.clueIndex}</div>
                            <div>Hint: {clue.clueText}</div>
                            <div>Solution: {clue.clueAnswer}</div>
                        </div>)}
                    </div>
                </div>
            }
        </div>
        <div className="removeHunter">
            <button className="removeHunterButton"
                onClick={removeHunter}>
                Remove Hunter
            </button>
        </div>
    </div>
}