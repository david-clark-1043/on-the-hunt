import Settings from "./Settings";
import { fetchIt } from "./Fetch";
import UserHuntRepository from "./UserHuntRepository";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/hunts/${id}`)
    },
    async deleteHunt(id) {
        // const filteredUserHunts = await UserHuntRepository.getByHuntId(id)
        return await fetchIt(`${Settings.remoteURL}/hunts/${id}`, "DELETE")
            .then(() => {
                // for (const userHunt of filteredUserHunts) {
                //     const deletedUH = UserHuntRepository.deleteUserHunt(userHunt)
                // }
            })
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/hunts`)
    }
}