import axios from "axios";

const API_URL_LIBRARY = import.meta.env.VITE_API_BASE_URL + '/Library';
const API_KEY_LIBRARY = import.meta.env.VITE_API_KEY;
const TMDB_SECRET = import.meta.env.VITE_TMDB_SECRET;

const instance = axios.create({
    baseURL: API_URL_LIBRARY,
    headers: {
        'ApiKey': API_KEY_LIBRARY,
    }
})

const tmdbInstace = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + TMDB_SECRET,
    }
})

export async function getLibraries() {
    const res = await instance.get();
    return res.data;
}

export async function getLibrary(params) {
    const res = await instance.get('/Filter' + params);
    return res.data;
}

export async function getMediaInfos(id) {
    const res = await instance.get("/Media?mediaId=" + id);
    return res.data;
}

export async function getTvShowInfos(id, lang) {
    const res = await tmdbInstace.get("tv/" + id + "?language=" + lang);
    return res.data;
}

export async function getTvShowCasting(id, lang) {
    const res = await tmdbInstace.get("tv/" + id + "/credits?language=" + lang);
    return res.data;
}

export async function getMovieInfos(id, lang) {
    const res = await tmdbInstace.get("movie/" + id + "?language=" + lang);
    return res.data;
}

export async function getMovieCasting(id, lang) {
    const res = await tmdbInstace.get("movie/" + id + "/credits?language=" + lang);
    return res.data;
}