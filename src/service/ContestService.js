import * as request from '~/untils/request';

export const createContest = async (data, token) => {
    let response;
    try {
        response = await request.postApi('/contests', data, {
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
