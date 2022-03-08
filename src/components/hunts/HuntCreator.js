import { useHistory } from "react-router-dom"
import "./HuntCreator.css";
import { HunterInvite } from "../dialog/HunterInvite";
import useModal from "../../hooks/useModal";
import { ConfirmDelete } from "../dialog/ConfirmDelete";

export const HuntCreator = (props) => {
    const history = useHistory()
    const {toggleDialog: toggleDeleteDialog, modalIsOpen: deleteIsOpen } = useModal("#dialog--delete")

    const checkProgressNav = (event) => {
        const [ , huntProgId, userProgId ] = event.target.id.split("--")
        const copy = JSON.parse(JSON.stringify(props))
        history.push(`/hunts/${huntProgId}/progress/${userProgId}`, copy)
    }

    return (
        <>
            <main className="mainContainer">
                <div className="huntBox">
                    <div>
                        <h2>Scavenger Hunt: {props.hunt.title}</h2>
                        <h3>Clues</h3>
                        <article className="stepList">
                            {props.clues?.map(clue => {
                                return <section className="singleStep" key={`clue--${clue.id}`}>
                                    <div className="stepInfo">
                                        <div className="clueStats">
                                            <div>Clue {clue.id}</div>
                                            <div>{clue.clueType?.type} clue</div>
                                        </div>
                                        <div className="clueText">{clue.clueText}</div>
                                    </div>
                                    <div className="stepButtons">
                                        <button className="stepEdit">
                                            Edit
                                        </button>
                                        <button className="stepDelete">
                                            Delete
                                        </button>
                                    </div>
                                </section>
                            })}
                        </article>
                    </div>
                    <div>
                        <h3>Hunters</h3>
                        <article className="hunterList">
                            {props.userHunts?.map(uh => {
                                if (uh.huntId === props.hunt.id) {
                                    return <div className="hunterStatus" key={`hunterStatus--${uh.id}`}>
                                        <div>{uh.user.name}</div>
                                        <div>Steps completed {uh.stepsCompleted}</div>
                                        <button className="checkProgressButton"
                                            id={`userHunt--${uh.huntId}--${uh.userId}`}
                                            onClick={checkProgressNav}>Check Progress</button>
                                    </div>
                                }
                            })}
                        </article>
                    </div>
                    <div>
                    <HunterInvite hunt={props.hunt} userHunts={props.userHunts} setUserHunts={props.setUserHunts} />
                    <ConfirmDelete toggleDeleteDialog={toggleDeleteDialog} hunt={props.hunt} />
                    <button onClick={toggleDeleteDialog}>Delete Hunt</button> 
                    </div>

                </div>
                {/* <button className="newHuntButton" onClick={newHuntNavigate}>New Hunt</button> */}
            </main>
        </>
    )
}