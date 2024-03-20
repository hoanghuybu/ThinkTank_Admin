import * as request from '~/untils/request';

export const getListLeaderboardGame = async (token, gameId) => {
    let res;
    try {
        res = await request.getApi(`/achievements/${gameId}/leaderboard`, {
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

export const getListLeaderboardContest = async (token, contestId) => {
    let res;
    try {
        res = await request.getApi(`/contests/${contestId}/leaderboard`, {
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
