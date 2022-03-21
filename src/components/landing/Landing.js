import { Link } from "react-router-dom"
import "./Landing.css"

export const Landing = () => {
    return (
        <>
            <main className="landingMain">
                <div className="landingContents">
                    <div className="landingHeader">
                        <div>
                            <img className="mapImg" src="/android-chrome-512x512.png" />
                        </div>
                        <h1>On the Hunt</h1>
                    </div>
                    <article className="landingArticle">
                        <p>
                            On the hunt allows users to create and share treasure and scavanger hunts.
                        </p>
                        <p>
                            Create an account to get on the hunt!
                        </p>
                    </article>
                    <article className="landingLinks">
                        <div>
                            <Link to="/login">Login</Link>
                        </div>
                        <div>
                            <Link to="/register">Register</Link>
                        </div>
                    </article>
                </div>
            </main>
            <footer>Check out my github for an explanation of the app</footer>
        </>
    )
}