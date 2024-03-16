import * as request from '~/untils/request';

export const getListTopicsOfGame = async (GameId, token) => {
    let response;
    try {
        const response = await request.getApi('/topics', {
            params: {
                GameId,
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

export const createNewTopic = async (data, token) => {
    let response;
    try {
        response = await request.postApi('/topics', data, {
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

export const createResource = async (data, token) => {
    let response;
    try {
        response = await request.postApi('/assets', data, {
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

export const getListResourceByGameID = async (Page, PageSize, GameId, token) => {
    let response;
    try {
        response = await request.getApi('/assets', {
            params: {
                Page,
                PageSize,
                GameId,
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

export const deleteReource = async (data, token) => {
    let response;
    console.log(data);
    try {
        response = await request.deleteApi('/assets', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            data: data,
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
