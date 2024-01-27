import axios from "axios";

const API_URL_SESSION = import.meta.env.VITE_API_BASE_URL + '/Session';
const API_KEY_SESSION = import.meta.env.VITE_API_KEY;

const instance = axios.create({
    baseURL: API_URL_SESSION,
    headers: {
        'ApiKey': API_KEY_SESSION,
    }
})

export async function sessionPause(SessionId) {
    try {
        const res = await instance.post('/PlayPause?sessionId=' + SessionId);
        return res.data;
    } catch (error) {
        console.error('Error while POST request /Session/PlayPause:', error);
        throw error;
    }
}

export async function sessionStart(SessionId) {
    try {
        const res = await instance.post('/PlayStart?sessionId=' + SessionId);
        return res.data;
    } catch (error) {
        console.error('Error while POST request /Session/PlayStart:', error);
        throw error;
    }
}

export async function sessionStop(SessionId) {
    try {
        const res = await instance.post('/PlayStop?sessionId=' + SessionId);
        return res.data;
    } catch (error) {
        console.error('Error while POST request /Session/PlayStop:', error);
        throw error;
    }
}

export async function sessionStopAll(Message) {
    try {
        const res = await instance.post('/WarnStopAll?msg=' + Message);
        return res.data;
    } catch (error) {
        console.error('Error while POST request /Session/PlayStop:', error);
        throw error;
    }
}