import * as request from '~/untils/request';

export const login = async (data) => {
    let response;
    try {
        response = await request.postNoToken('/accounts/authentication-admin', data);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            throw error;
        }
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const logout = async (accountId) => {
    let response;
    try {
        response = await request.postApi(`/accounts/${accountId}/token-revoke`);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            throw error;
        }
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};
