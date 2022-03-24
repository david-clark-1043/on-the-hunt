import { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import checkUser from "../../hooks/checkUser"
import ClueRepository from "../../repositories/ClueRepository"
import HuntRepository from "../../repositories/HuntRepository"
import UserHuntRepository from "../../repositories/UserHuntRepository"
import { HuntCreator } from "../huntCreator/HuntCreator"
import { HuntParticipant } from "../huntParticipant/HuntParticipant"


export const Hunt = () => {
    const [loading, setLoading] = useState(true)
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
            const user = getCurrentUser().userId
            const foundUserHunt = userHunts.find(uh => uh.huntId == parseInt(huntId) && uh.userId == user)
            setUserHunt(foundUserHunt)
        }, [userHunts]
    )

    return <main>
        <div className="loading" style={{ visibility: loading ? "visible" : "hidden" }}>
            Loading...
        </div>
        <div style={{ visibility: loading ? "hidden" : "visible" }}>
        {getCurrentUser().userId === hunt.userId
            ? <HuntCreator
                hunt={hunt}
                userHunts={userHunts}
                currentUser={getCurrentUser().userId}
                clues={clues}
                setUserHunts={setUserHunts}
                setClues={setClues}
                setHunt={setHunt}
                loading={loading}
                setLoading={setLoading} />
            : <HuntParticipant
                hunt={hunt}
                userHunt={userHunt}
                currentUser={getCurrentUser().userId}
                clues={clues}
                setUserHunts={setUserHunts}
                setClues={setClues}
                loading={loading}
                setLoading={setLoading}
            />
        }
        </div>
        {
            // JSON.stringify(clues)
        }
    </main>
}