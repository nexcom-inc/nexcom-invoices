import axios from 'axios';



const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      mode: 'no-cors'
    },
    withCredentials: true,
  });

AxiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401 || error.response.status === 403) {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;