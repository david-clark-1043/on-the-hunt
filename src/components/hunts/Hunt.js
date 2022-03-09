import { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import checkUser from "../../hooks/checkUser"
import ClueRepository from "../../repositories/ClueRepository"
import HuntRepository from "../../repositories/HuntRepository"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import { HuntCreator } from "./HuntCreator"
import { HuntParticipant } from "./HuntParticipant"


export const Hunt = () => {
    const [hunt, setHunt] = useState({})
    const [userHunts, setUserHunts] = useState([])
    const [userHunt, setUserHunt] = useState([])
    //const [currentUser, setUser] = useState(null)
    const [clues, setClues] = useState([])
    const history = useHistory()
    const { getCurrentUser } = checkUser()
    const { huntId } = useParams()

    useEffect(
        () => {
            if (huntId) {
                HuntRepository.get(huntId)
                    .then(setHunt)
                    .then(() => {
                        return UserHuntRepository.getAll()
                    })
                    .then(setUserHunts)
                    .then(() => {
                        return ClueRepository.getCluesForHunt(huntId)
                    })
                    .then(setClues)
            }
        },
        [huntId]
    )

    useEffect(
        () => {
            const user = getCurrentUser()
            const foundUserHunt = userHunts.find(uh => uh.huntId == parseInt(huntId) && uh.userId == user)
            setUserHunt(foundUserHunt)
        }, [userHunts]
    )

    return <main>
        {getCurrentUser() === hunt.userId
            ? <HuntCreator
                hunt={hunt}
                userHunts={userHunts}
                currentUser={getCurrentUser()}
                clues={clues}
                setUserHunts={setUserHunts}
                setClues={setClues}
                setHunt={setHunt} />
            : <HuntParticipant
                hunt={hunt}
                userHunt={userHunt}
                currentUser={getCurrentUser()}
                clues={clues}
            // setUserHunts = { setUserHunts }
            // setClues = { setClues }
            // setHunt = { setHunt } 
            />
        }
        {
            // JSON.stringify(clues)
        }
    </main>
}