import axios from "axios";
import { BASE_URL } from "./helpers";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    // headers: { "Content-Type": "application/json" },
    withCredentials: true,

});
export default axiosClient;
