import * as request from '~/untils/request';

export const login = async (data) => {
    let response;
    try {
        response = await request.postApi('/accounts/authentication-admin', data);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const logout = async (accountId, token) => {
    let response;
    try {
        response = await request.postApi('/accounts/token-revoke', {
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
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};
