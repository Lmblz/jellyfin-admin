import axios from "axios";

const TMDB_SECRET = import.meta.env.VITE_TMDB_SECRET;

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3/movie/',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_SECRET}`
    }
})

// Récupération de l'état actuel
export async function getMovie(movieId) {
    const res = await instance.get(`/${movieId}?language=fr-FR`);
    return res.data;
}