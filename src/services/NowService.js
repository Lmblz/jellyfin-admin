import axios from "axios";

// Requete vers le répertoire json temporaire
const JSON_BIN_SECRET = import.meta.env.VITE_JSON_BIN_SECRET;

const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3/b/6544064e12a5d37659940bef',
    headers: { 'X-Master-Key': JSON_BIN_SECRET }
})

// Récupération de l'état actuel
export async function getAll() {
    const res = await instance.get('/latest');
    return res.data.record;
}