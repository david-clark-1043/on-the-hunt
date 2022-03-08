import { useEffect, useState } from "react"
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
    const [currentUser, setUser] = useState(0)
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
                    .then(() => {
                        return setUser(getCurrentUser())
                    })
            }
        },
        [huntId]
    )

    return <main>
        {currentUser === hunt.userId
            ? <HuntCreator
                hunt = { hunt }
                userHunts = { userHunts }
                currentUser = { currentUser }
                clues = { clues }
                setUserHunts = { setUserHunts }
                setClues = { setClues }
                setHunt = { setHunt } />
            : <HuntParticipant
                hunt = { hunt }
                userHunts = { userHunts }
                currentUser = { currentUser }
                clues = { clues }
                setUserHunts = { setUserHunts }
                setClues = { setClues }
                setHunt = { setHunt } />
        }
        {
            // JSON.stringify(clues)
        }
    </main>
}