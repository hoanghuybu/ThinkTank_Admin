import * as request from '~/untils/request';

export const getListTopicsOfGame = async (GameId) => {
    let response;
    try {
        const response = await request.getApi('/topics', {
            params: {
                GameId,
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

export const createNewTopic = async (data) => {
    let response;
    try {
        response = await request.postApi('/topics', data);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const createResource = async (data) => {
    let response;
    try {
        response = await request.postApi('/assets', data);
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (response && response.request && response.request._headerSent) {
            response.request.end();
        }
    }
};

export const getListResourceByGameID = async (Page, PageSize, GameId) => {
    let response;
    try {
        response = await request.getApi('/assets', {
            params: {
                Page,
                PageSize,
                GameId,
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

export const deleteResource = async (data) => {
    let response;
    console.log(data);
    try {
        response = await request.deleteApi('/assets', {
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
