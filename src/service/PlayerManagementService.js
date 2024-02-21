import * as request from '~/untils/request';

export const getListPlayers = async (Page, PageSize, token) => {
    try {
        const res = await request.getApi('/accounts', {
            params: {
                Page,
                PageSize,
            },
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const banPlayers = async (accountId, token) => {
    try {
        const res = await request.getApi(`/accounts/${accountId}/account-banned`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
