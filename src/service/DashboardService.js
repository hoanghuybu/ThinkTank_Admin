import * as request from '~/untils/request';

export const getListGames = async () => {
    let res;
    try {
        res = await request.getApi('/games');
        return res.data;
    } catch (error) {
        if (error.response.status !== 403) {
            throw error;
        }
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};

export const getGameReport = async () => {
    let res;
    try {
        res = await request.getApi('/games/game-report');
        return res.data;
    } catch (error) {
        if (error.response.status !== 403) {
            throw error;
        }
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};

export const getContestReport = async () => {
    let res;
    try {
        res = await request.getApi('/contests/contest-report');
        return res.data;
    } catch (error) {
        if (error.response.status !== 403) {
            throw error;
        }
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};
