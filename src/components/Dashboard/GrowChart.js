import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GrowChart() {
    let cardColor, headingColor;
    const navigate = useNavigate();
    const [series, setSeries] = useState([78]);

    cardColor = '#fff';
    headingColor = '#566a7f';
    const state = {
        options: {
            labels: ['Growth'],
            chart: {
                height: 240,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    size: 150,
                    offsetY: 10,
                    startAngle: -150,
                    endAngle: 150,
                    hollow: {
                        size: '55%',
                    },
                    track: {
                        background: cardColor,
                        strokeWidth: '100%',
                    },
                    dataLabels: {
                        name: {
                            offsetY: 15,
                            color: headingColor,
                            fontSize: '15px',
                            fontWeight: '600',
                            fontFamily: 'Public Sans',
                        },
                        value: {
                            offsetY: -25,
                            color: headingColor,
                            fontSize: '22px',
                            fontWeight: '500',
                            fontFamily: 'Public Sans',
                        },
                    },
                },
            },
            colors: ['#696cff'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#696cff'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 0.6,
                    stops: [30, 70, 100],
                },
            },
            stroke: {
                dashArray: 5,
            },
            grid: {
                padding: {
                    top: -35,
                    bottom: -10,
                },
            },
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
        },
    };

    const handleRefresh = async () => {
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
    const fecthDataGrow = async () => {
        try {
            const response = await fetch(
                'https://beprn231catdoglover20231105200231.azurewebsites.net/api/Posts/getStatitic',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                },
            );
            if (response.status === 200) {
                const responseData = await response.json();
                const newSeries = (responseData.postToday / responseData.postTotal) * 100;
                setSeries([newSeries]);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fecthDataGrow();
    }, []);
    return (
        <div id="chart">
            <ReactApexChart options={state.options} series={series} type="radialBar" height={240} />
        </div>
    );
}

export default GrowChart;
