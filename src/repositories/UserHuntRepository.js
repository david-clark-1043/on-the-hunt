import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/userHunts/${id}?_embed=user&_embed=hunt`)
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/userHunts?_expand=user&_expand=hunt`)
    }
}