import * as request from '~/untils/request';

export const getAnalysisByAccountId = async (accountId) => {
    let response;
    try {
        response = await request.getApi(`/analyses/${accountId}`);
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
