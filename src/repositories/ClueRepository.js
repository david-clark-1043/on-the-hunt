import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/clues/${id}`)
    },
    async getCluesForHunt(huntId) {
        return await fetchIt(`${Settings.remoteURL}/clues?huntId=${huntId}`)
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/clues`)
    }
}