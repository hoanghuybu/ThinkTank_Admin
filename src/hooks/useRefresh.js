import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const handleRefresh = async (navigate) => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            const response = await fetch(
                `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Auth/RefreshToken/${refreshToken}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('refreshToken', data.refreshToken);
                window.location.reload();
            } else {
                console.error('Error refreshing token');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        navigate('/');
    }
};

function useRefresh() {
    const navigate = useNavigate();

    useEffect(() => {
        handleRefresh(navigate);
    }, []);
}

export default useRefresh;
