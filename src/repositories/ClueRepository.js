import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/clues/${id}`)
    },
    async getCluesForHunt(huntId) {
        return await fetchIt(`${Settings.remoteURL}/clues?huntId=${huntId}&_expand=clueType`)
    },
    async updateClue(clue) {
        return await fetchIt(`${Settings.remoteURL}/clues/${clue.id}`, "PUT", JSON.stringify(clue))
    },
    async deleteClue(clue) {
        return await fetchIt(`${Settings.remoteURL}/clues/${clue.id}`, "DELETE")
    },
    async addClue(clue) {
        return await fetchIt(`${Settings.remoteURL}/clues`, "POST", JSON.stringify(clue))
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/clues`)
    }
}