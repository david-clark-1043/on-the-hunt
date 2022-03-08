import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/userHunts/${id}?_expand=user&_expand=hunt`)
    },
    async sendUserHunt(userHunt) {
        return await fetchIt(`${Settings.remoteURL}/userHunts/${userHunt.id}`, "PUT", JSON.stringify(userHunt))
    },
    async deleteUserHunt(userHunt) {
        return await fetchIt(`${Settings.remoteURL}/userHunts/${userHunt.id}`, "DELETE")
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/userHunts?_expand=user&_expand=hunt`)
    }
}