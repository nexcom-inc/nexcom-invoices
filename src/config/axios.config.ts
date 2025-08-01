import { INVOICE_API_URL } from "@/constants";
import { AxiosRequestConfig } from "axios";

export const axiosConfig : AxiosRequestConfig = {
    baseURL: INVOICE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
}