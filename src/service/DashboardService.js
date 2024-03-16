import * as request from '~/untils/request';

export const getListGames = async (token) => {
    let res;
    try {
        res = await request.getApi('/games', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};

export const getGameReport = async (token) => {
    let res;
    try {
        res = await request.getApi('/games/game-report', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};

export const getContestReport = async (token) => {
    let res;
    try {
        res = await request.getApi('/contests/contest-report', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    } finally {
        if (res && res.request && res.request._headerSent) {
            res.request.end();
        }
    }
};
