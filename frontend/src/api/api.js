import axios from "axios";
const base_url = import.meta.env.VITE_BACKEND_URL;

export const checkUrl = async () => {
    const response = await axios.get(`${base_url}/status`);
    console.log(response.data);
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${base_url}/status/history`);
    // console.log(response.data);
    return response.data;
};
