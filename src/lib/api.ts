import { axiosConfig } from '@/config';
import { LOGIN_URL } from '@/constants';
import axios, { HttpStatusCode } from 'axios';

const apiClient = axios.create({...axiosConfig});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      window.location.href = LOGIN_URL
    }
    return Promise.reject(error)
  }
)



export default apiClient;