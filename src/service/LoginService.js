import * as request from '~/untils/request';

export const login = async (data) => {
    try {
        const response = await request.postApi('/accounts/authentication-admin', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async (accountId, token) => {
    try {
        const response = await request.postApi('/accounts/token-revoke', {
            params: {
                accountId,
            },
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
