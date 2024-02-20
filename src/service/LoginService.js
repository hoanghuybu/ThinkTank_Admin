import * as request from '~/untils/request';

export const login = async (data) => {
    try {
        const response = await request.postApi('/accounts/authentication', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
