
export const InviteSearch = ({ setSearchInput }) => {

    return (
        <form className="userSearchBar">
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Search: </label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Search name"
                        onChange={(evt) => {
                            setSearchInput(evt.target.value)
                        }} />
                </div>
            </fieldset>
        </form>
    )
}