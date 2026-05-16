import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// PUBLIC AXIOS

const axiosClient = axios.create({
    baseURL: BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

// PRIVATE AXIOS

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});


export default axiosClient;
