import axios from "axios";

const API_URL_HISTORY = import.meta.env.VITE_API_BASE_URL + '/api/history';
const API_KEY_HISTORY = import.meta.env.VITE_API_KEY;

const instance = axios.create({
    baseURL: API_URL_HISTORY,
    headers: {
        ApiKey: API_KEY_HISTORY,
    },
});

// Récupération de l'état actuel
export async function get(param) {
    const res = await instance.get(param);
    return res.data;
}
