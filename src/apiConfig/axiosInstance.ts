import axios from "axios"

const axiosInstance = axios.create({
    baseURL:'https://social-network-votta-be.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export default  axiosInstance;