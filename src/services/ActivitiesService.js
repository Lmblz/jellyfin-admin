import axios from "axios";

// Requete vers le répertoire json temporaire
const API_URL_NOW = import.meta.env.VITE_API_URL_NOW;

const instance = axios.create({
    baseURL: API_URL_NOW,
})

// Récupération de l'état actuel
export async function getAll() {
    const res = await instance.get('/now');
    return res.data;
}