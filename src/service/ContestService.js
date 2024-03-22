import * as request from '~/untils/request';

export const createContest = async (data) => {
    let response;
    try {
        response = await request.postApi('/contests', data);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const getListContestByGameID = async (Page, PageSize, GameId, ContestStatus) => {
    let response;
    try {
        response = await request.getApi('/contests', {
            params: {
                Page,
                PageSize,
                GameId,
                ContestStatus,
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

export const updateContest = async (data, id) => {
    let response;
    try {
        response = await request.putApi(`/contests/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};
