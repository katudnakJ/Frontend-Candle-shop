import axios from "axios";
import { appConfig } from "../config/appConfig";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Status } from "@/types/response.type";


const apiClient = axios.create({
    baseURL: appConfig.v1localApiEndpointUrl,
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
    },  
});

// FE -> BE
apiClient.interceptors.request.use((config) => {
    if(config.data && !(config.data instanceof FormData)) {
        config.data = decamelizeKeys(config.data);
    }

    if (config.params) {
        config.params = decamelizeKeys(config.params);
    }

    return config;
})

// BE -> FE
apiClient.interceptors.response.use(
    (response) => {
        if(response.data) {
            response.data = camelizeKeys(response.data);
        }
        return response.data;
    },
    (error) => {
        const err : Status = {
            status: error.response?.data?.status,
            message: error.response?.data?.message,
            remark: error.response?.data?.remark
        };

        if (err.status === undefined ){
           console.log("Carmel Parsing Error Interceptor:", error);
        return Promise.reject(error);
        }else{
            console.log("Carmel Parsing Error Interceptor:", err);
            return Promise.reject(err);
        }
        
    }
)

export { apiClient };