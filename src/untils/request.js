import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const requestAPI = axios.create({
    baseURL: process.env.REACT_APP_THINK_TANK_URL,
});

export const get = async (path, option = {}) => {
    const respone = await request.get(path, option);
    return respone;
};

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
