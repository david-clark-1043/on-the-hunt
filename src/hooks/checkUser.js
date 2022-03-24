


const checkUser = () => {

    const getCurrentUser = () => {
        const customerObject = JSON.parse(localStorage.getItem("hunt_customer"))
        return customerObject
    }

    return { getCurrentUser }
}

export default checkUser