import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import checkUser from "../../hooks/checkUser";
import HuntRepository from "../../repositories/HuntRepository";
import UserHuntRepository from "../../repositories/UserHuntRepository";
import { Modal } from "react-dialog-polyfill"
import "./MyHunt.css";

export const MyHunts = () => {
    const [loading, setLoading] = useState(true)
    const [hunts, setHunts] = useState([""])
    const [userHunts, setUserHunts] = useState([""])
    const [huntmasterList, setHuntmaster] = useState([0])
    const [hunterList, setHunterList] = useState([0])
    const [huntmasterJSX, setHuntmasterJSX] = useState([""])
    const [hunterJSX, setHunterJSX] = useState([""])
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
                .then(() => {
                })
        },
        []
    )

    useEffect(
        () => {
            if(currentUser > 0) {
                let filteredHunts = []
                let filteredUserHunts = []
                if (typeof hunts[0] === 'object') {
                    filteredHunts = hunts.filter(hunt => hunt.userId === currentUser)
                    if(typeof filteredHunts[0] === 'object') {
                        setHuntmaster(filteredHunts)
                    } else {
                        setHuntmaster([""])
                    }
                }
                if (typeof userHunts[0] === 'object') {
                    filteredUserHunts = userHunts.filter(userHunt => userHunt.userId === currentUser)
                    if(typeof filteredUserHunts[0] === 'object') {
                        setHunterList(filteredUserHunts)
                    } else {
                        setHunterList([""])
                    }
                }
            }
        }, [hunts, userHunts, currentUser]
    )

    useEffect(
        () => {
            if (typeof huntmasterList[0] === "string") {
                setHuntmasterJSX([<div>You have no hunts</div>])
            } else if (typeof huntmasterList[0] === 'object') {
                const JSX = huntmasterList.map(hunt => {
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
                setHuntmasterJSX(JSX)
            }
        }, [huntmasterList]
    )
    useEffect(
        () => {
            if (typeof hunterList[0] === "string") {
                setHunterJSX([<div>You have no hunts</div>])
            } else if (typeof hunterList[0] === 'object') {
                const JSX = hunterList.map(hunt => {
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
                setHunterJSX(JSX)
            }
        }, [hunterList]
    )

    useEffect(
        () => {
            const hunterCheck = typeof hunterJSX[0] === 'object'
            const huntmasterCheck = typeof huntmasterJSX[0] === 'object'
            if(hunterCheck && huntmasterCheck) {
                setLoading(false)
            }
        }, [hunterJSX, huntmasterJSX]
    )

    // filteredHunts.map(hunt => {
    //     return (
    //         <div key={hunt.hunt?.id ? `hunter--${hunt.hunt.id}` : `huntmaster--${hunt.id}`}>
    //             {hunt.hunt
    //                 ? <button
    //                     className="huntTitle"
    //                     id={`${hunt.hunt.id}`}
    //                     onClick={huntNavigate}>
    //                     {hunt.hunt.title}
    //                 </button>
    //                 : <button
    //                     className="huntTitle"
    //                     id={`${hunt.id}`}
    //                     onClick={huntNavigate}>
    //                     {hunt.title}
    //                 </button>
    //             }
    //         </div>

    //     )
    // })
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
            <main className="mainContainer" >
                <div className="loading" style={{visibility: loading ? "visible" : "hidden"}}>
                    Loading...
                </div>
                <div className="hunts" style={{visibility: loading ? "hidden" : "visible"}}>
                    <h2>Your Hunts</h2>
                    <article className="huntList">
                        <div className="huntmaster">
                            <h3>Huntmaster:</h3>
                            <section className="huntmasterList">
                                {huntmasterJSX}
                            </section>
                        </div>

                        <div className="asHunter">
                            <h3>Hunter:</h3>
                            <section className="asHunterList">
                                {hunterJSX}
                            </section>
                        </div>
                    </article>
                </div>
            </main >
        </>
    )
}