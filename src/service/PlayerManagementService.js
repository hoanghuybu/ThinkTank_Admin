import * as request from '~/untils/request';

export const getListPlayers = async (Page, PageSize) => {
    try {
        const res = await request.get('/accounts', {
            params: {
                Page,
                PageSize,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
