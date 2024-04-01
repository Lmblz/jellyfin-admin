import axios from "axios";

const API_URL_NOW = import.meta.env.VITE_API_BASE_URL + '/api/now';
const API_KEY_NOW = import.meta.env.VITE_API_KEY;

const instance = axios.create({
    baseURL: API_URL_NOW,
    headers: {
        'ApiKey': API_KEY_NOW
    }
})

// Récupération de l'état actuel
export async function getAll() {
    const res = await instance.get();
    return res.data;
}