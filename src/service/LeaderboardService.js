import * as request from '~/untils/request';

export const getListLeaderboardGame = async (gameId) => {
    let res;
    try {
        res = await request.getApi(`/achievements/${gameId}/leaderboard`);
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

export const getListLeaderboardContest = async (contestId) => {
    let res;
    try {
        res = await request.getApi(`/contests/${contestId}/leaderboard`);
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
