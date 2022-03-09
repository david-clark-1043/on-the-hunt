import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/clues/${id}`)
    },
    async getCluesForHunt(huntId) {
        return await fetchIt(`${Settings.remoteURL}/clues?huntId=${huntId}&_expand=clueType`)
    },
    async addClue(clue) {
        return await fetchIt(`${Settings.remoteURL}/clues`, "POST", JSON.stringify(clue))
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/clues`)
    }
}