import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import "./HuntParticipant.css"

export const HuntParticipant = (props) => {
    const [currentClue, setCurrentclue] = useState({})
    const [completedClues, setCompletedClues] = useState([])
    const [JSX, setJSX] = useState([])
    const [locChecking, setChecking] = useState(false)
    const [dimensions, setDim] = useState({height: 0, width: 0})
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
        }, [props.userHunt, props.userHunts, props.clues]
    )

    useEffect(
        () => {
            if (typeof currentClue === 'object' && "clueType" in currentClue) {
                if (props.userHunt.stepsCompleted >= props.clues.length) {
                    const currentStepJSX = [<div className="huntCompleteBox" key={"currentClue--complete"}>
                        <div>Hunt Complete!</div>
                        <div>{props.hunt.rewardText}</div>
                    </div>]
                    setJSX(currentStepJSX)
                } else {
                    const currentStepJSX = [
                        <div key={"currentClue--1"}>
                            <h3 className="currentStepTitle">Clue {props.clues?.findIndex(clue => clue.id === currentClue?.id) + 1} of {props.clues.length}</h3>
                            <div className="currentClueType">
                                Category: {currentClue.clueType.type} Clue
                            </div>
                            <div className="currentClueText">
                                {currentClue.clueText}
                            </div>
                            <div>
                                {
                                    currentClue.clueType.type === "Location"
                                        ? <div>
                                            <button onClick={() => {
                                                const box = document.getElementById("clueBox")
                                                const newDim = {
                                                    height: box.offsetHeight,
                                                    width: box.offsetWidth
                                                }
                                                setDim(newDim)
                                                setChecking(true)
                                            }}>
                                                Check Location
                                            </button>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                    ]
                    setJSX(currentStepJSX)
                }
            }
        }, [currentClue, completedClues]
    )

    useEffect(
        () => {
            if(typeof JSX[0] === 'object') {
                props.setLoading(false)
            }
        }, [JSX]
    )

    useEffect(
        () => {
            if(locChecking) {
                const error = () => {
                    setChecking(false)
                    window.alert("Unable to get your location.\nTry turning on location services.")
                }

                const success = (position) => {
                    /*
                        at lat 36 degrees
                        1 lat is ~ 362775.7596463947 ft
                        1ft = 1 / 362775.7596463947
                        want to be within 500ft radius of solution
                        = 0.00137826187859784431313755449841 degrees
                         36.1271556323669
                    */
                    // get clue answer from state
                    // get lat and long from clue answer
                    const clueLat = currentClue.lat
                    const clueLng = currentClue.lng
            
                    // calc distance from person to target
                    const personLat = position.coords.latitude
                    const personLng = position.coords.longitude
            
                    // if less than 500ft
                    const maxDistance = 0.0013782618785
            
                    const distance = Math.sqrt(((clueLat - personLat) ** 2) + ((clueLng - personLng) ** 2))
            
                    if (distance < maxDistance) {
                        const copy = JSON.parse(JSON.stringify(props.userHunt))
                        delete copy.user
                        delete copy.hunt
                        copy.stepsCompleted++
                        UserHuntRepository.updateUserHunt(copy)
                            .then(() => {
                                return UserHuntRepository.getAll()
                            })
                            .then(props.setUserHunts)
                            .then(() => setChecking(false))
                    } else {
                        const distInFeet = Math.floor((distance / maxDistance) * 500)
                        let string = `Too far from goal.\n You are ${distInFeet.toLocaleString('en-US')} feet away.`
                        setChecking(false)
                        window.alert(string)
                    }
                }
            
                const checkLocation = () => {
                    // get person lat and long from browser
                    if (!navigator.geolocation) {
                        window.alert('Geolocation is not supported by your browser')
                    } else {
                        navigator.geolocation.getCurrentPosition(success, error);
                    }
                }

                checkLocation()

            }
        }, [locChecking]
    )


    return <>
        <main className="clueContainer">
            {
                locChecking
                ? <div className="checkingLocation" style={{height: dimensions.height, width: dimensions.width}}>
                    <div>
                        Checking your location
                    </div>
                </div>
                : <div className="clueBox" id="clueBox">
                    <div>
                        <div className="header">
                            <div><h2>{props.hunt.title}</h2></div>
                            <button onClick={() => history.goBack()}>Back</button>
                        </div>
                        <div className="currentStepBox">
                            {JSX}
                        </div>
                        <div className="compeletedStepsBox">
                            <h3>Completed Clues</h3>
                            {
                                completedClues.map((compClue, index) => {
                                    return <div className="completedClueListing" key={`completedClue--${compClue.id}`}>
                                        <div>Clue {index + 1}</div>
                                        <div>Hint: {compClue.clueText}</div>
                                        <div>Answer: {compClue.clueAnswer}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            
        </main>
    </>
}