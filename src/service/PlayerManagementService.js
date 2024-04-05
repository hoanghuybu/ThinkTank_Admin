import * as request from '~/untils/request';

export const getListPlayers = async (Page, PageSize) => {
    let response;
    try {
        response = await request.getApi('/accounts', {
            params: {
                Page,
                PageSize,
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

export const banPlayers = async (accountId) => {
    let response;
    try {
        response = await request.getApi(`/accounts/${accountId}/account-banned`);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const listReports = async (accountId) => {
    let response;
    try {
        response = await request.getApi(`/reports?AccountId2=${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};
