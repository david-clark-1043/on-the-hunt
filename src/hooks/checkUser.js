


const checkUser = () => {

    const getCurrentUser = () => {
        const userId = parseInt(localStorage.getItem("hunt_customer"))
        return userId
    }

    return { getCurrentUser }
}

export default checkUser