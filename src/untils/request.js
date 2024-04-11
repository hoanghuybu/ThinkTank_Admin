import axios from 'axios';
import { toast } from 'react-toastify';

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const requestAPI = axios.create({
    baseURL: process.env.REACT_APP_THINK_TANK_URL,
});

const requestNoToken = axios.create({
    baseURL: process.env.REACT_APP_THINK_TANK_URL,
});

export const get = async (path, option = {}) => {
    const respone = await request.get(path, option);
    return respone;
};

export const getNoToken = async (path, option = {}) => {
    const responseAPI = await requestNoToken.get(path, option);
    return responseAPI;
};

export const postNoToken = async (path, data, option = {}) => {
    const responseAPI = await requestNoToken.post(path, data, option);
    return responseAPI;
};

export const putNoToken = async (path, data, option = {}) => {
    const responseAPI = await requestNoToken.put(path, data, option);
    return responseAPI;
};

export const patchNoToken = async (path, data, option = {}) => {
    const responseAPI = await requestNoToken.patch(path, data, option);
    return responseAPI;
};

export const deleteNoToken = async (path, option = {}) => {
    const responseAPI = await requestNoToken.delete(path, option);
    return responseAPI;
};

const refreshAccessToken = async () => {
    try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        const accessToken = sessionStorage.getItem('accessToken');
        if (!refreshToken) {
            toast.error('No refreshToken');
            return null;
        }

        if (!accessToken) {
            toast.error('No accessToken');
            return null;
        }

        const data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };

        const response = await requestNoToken.post('/accounts/token-verification', data);

        const resAccessToken = await response.data.accessToken;
        sessionStorage.setItem('accessToken', resAccessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
        return resAccessToken;
    } catch (error) {
        toast.error('Error refreshing access token:', error);
        return null;
    }
};

requestAPI.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    async (error) => {
        return Promise.reject(error);
    },
);

requestAPI.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log(error.config);
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await refreshAccessToken();
            if (accessToken) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    },
);

export const getApi = async (path, option = {}) => {
    const responseAPI = await requestAPI.get(path, option);
    return responseAPI;
};

export const postApi = async (path, data, option = {}) => {
    const responseAPI = await requestAPI.post(path, data, option);
    return responseAPI;
};

export const putApi = async (path, data, option = {}) => {
    const responseAPI = await requestAPI.put(path, data, option);
    return responseAPI;
};

export const patchApi = async (path, data, option = {}) => {
    const responseAPI = await requestAPI.patch(path, data, option);
    return responseAPI;
};

export const deleteApi = async (path, option = {}) => {
    const responseAPI = await requestAPI.delete(path, option);
    return responseAPI;
};
export default request;
