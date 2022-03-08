import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import checkUser from "../../hooks/checkUser"
import ClueRepository from "../../repositories/ClueRepository"
import HuntRepository from "../../repositories/HuntRepository"
import UserHuntRepository from "../../repositories/UserHuntRepository"


export const Hunt = () => {
    const [hunts, setHunts] = useState()
    const [userHunts, setUserHunts] = useState([])
    const [currentUser, setUser] = useState(0)
    const [clues, setClues] = useState([])
    const history = useHistory()
    const { getCurrentUser } = checkUser()
    const { huntId } = useParams()

    useEffect(
        () => {
            HuntRepository.getAll()
                .then(setHunts)
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
        },
        []
    )

    return <div>{
        // JSON.stringify(clues)
        }</div>
}