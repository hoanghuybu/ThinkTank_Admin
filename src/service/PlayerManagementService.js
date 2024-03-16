import * as request from '~/untils/request';

export const getListPlayers = async (Page, PageSize, token) => {
    let response;
    try {
        response = await request.getApi('/accounts', {
            params: {
                Page,
                PageSize,
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

export const banPlayers = async (accountId, token) => {
    let response;
    try {
        response = await request.getApi(`/accounts/${accountId}/account-banned`, {
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
