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

export const getListContestByGameID = async (Page, PageSize, GameId, ContestStatus, token) => {
    let response;
    try {
        response = await request.getApi('/contests', {
            params: {
                Page,
                PageSize,
                GameId,
                ContestStatus,
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

export const updateContest = async (data, id, token) => {
    let response;
    try {
        response = await request.putApi(`/contests/${id}`, data, {
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
