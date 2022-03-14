import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import checkUser from "../../hooks/checkUser";
import HuntRepository from "../../repositories/HuntRepository";
import UserHuntRepository from "../../repositories/UserHuntRepository";
import "./MyHunt.css";

export const MyHunts = () => {
    const [hunts, setHunts] = useState([])
    const [userHunts, setUserHunts] = useState([])
    const [currentUser, setUser] = useState(0)
    const history = useHistory()

    const { getCurrentUser } = checkUser()
    useEffect(
        () => {
            HuntRepository.getAll()
                .then(setHunts)
                .then(() => {
                    return UserHuntRepository.getAll()
                })
                .then(setUserHunts)
                .then(() => {
                    return setUser(getCurrentUser())
                })
        },
        []
    )

    const newHuntNavigate = () => {
        history.push("/hunts/create")
    }

    const huntNavigate = (event) => {
        history.push(`/hunts/${event.target.id}`)
    }

    const huntList = (list) => {
        // list of hunts where userId = hunt.userId
        const filteredHunts = list.filter(hunt => hunt.userId === currentUser)
        if (filteredHunts.length > 0) {
            return (
                <>
                    {filteredHunts.map(hunt => {
                        return (
                            <div key={hunt.hunt?.id ? `hunter--${hunt.hunt.id}` : `huntmaster--${hunt.id}`}>
                                {hunt.hunt
                                    ? <button
                                        className="huntTitle"
                                        id={`${hunt.hunt.id}`}
                                        onClick={huntNavigate}>
                                        {hunt.hunt.title}
                                    </button>
                                    : <button
                                        className="huntTitle"
                                        id={`${hunt.id}`}
                                        onClick={huntNavigate}>
                                        {hunt.title}
                                    </button>
                                }
                            </div>

                        )
                    })
                    }
                </>
            )
        }
        return (
            <div>You have no hunts.</div>
        )
    }

    return (
        <>
            <main className="mainContainer">
                <div className="hunts">
                    <h2>Your Hunts</h2>
                    <article className="huntList">
                        <div className="huntmaster">
                            <h3>Huntmaster for:</h3>
                            <section className="huntmasterList">
                                {huntList(hunts)}
                            </section>
                        </div>

                        <div className="asHunter">
                            <h3>Hunting:</h3>
                            <section className="asHunterList">
                                {huntList(userHunts)}
                            </section>
                        </div>
                    </article>
                </div>
                {/* <button className="newHuntButton" onClick={newHuntNavigate}>New Hunt</button> */}
            </main >
            {/* {`${JSON.stringify(process.env)}`} */}
        </>
    )
}