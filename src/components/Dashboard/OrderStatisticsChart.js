import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderStatisticsChart() {
    let cardColor, headingColor, axisColor;
    const navigate = useNavigate();

    const [postGiftTotal, setPostGiftTotal] = useState();
    const [postServiceTotal, setPostServiceTotal] = useState();
    const [postProductTotal, setPostProductTotal] = useState();
    const [series, setSeries] = useState([85, 15, 50]);
    cardColor = '#fff';
    headingColor = '#566a7f';
    axisColor = '#a1acb8';
    const state = {
        options: {
            chart: {
                height: 165,
                width: 130,
                type: 'donut',
            },
            labels: ['Gifts', 'Service', 'Product'],

            colors: ['#696cff', '#03c3ec', '#71dd37'],
            stroke: {
                width: 5,
                colors: cardColor,
            },
            dataLabels: {
                enabled: false,
                formatter: function (val, opt) {
                    return parseInt(val) + '%';
                },
            },
            legend: {
                show: false,
            },
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    right: 15,
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            value: {
                                fontSize: '1.5rem',
                                fontFamily: 'Public Sans',
                                color: headingColor,
                                offsetY: -15,
                                formatter: function (val) {
                                    return parseInt(val) + '%';
                                },
                            },
                            name: {
                                offsetY: 20,
                                fontFamily: 'Public Sans',
                            },
                            total: {
                                show: true,
                                fontSize: '0.8125rem',
                                color: axisColor,
                                label: 'Post',
                                formatter: function (w) {
                                    return '100%';
                                },
                            },
                        },
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
    const fecthPostGiftCount = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts/$count?$filter=type%20eq%20%27gift%27',
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
                setPostGiftTotal(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };
    const fecthPostServiceCount = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts/$count?$filter=type%20eq%20%27service%27',
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
                setPostServiceTotal(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };
    const fecthPostProductCount = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts/$count?$filter=type%20eq%20%27product%27',
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
                setPostProductTotal(responseData);
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
        fecthPostGiftCount();
        fecthPostProductCount();
        fecthPostServiceCount();
    }, []);

    useEffect(() => {
        const newSeries = [postGiftTotal, postServiceTotal, postProductTotal];
        setSeries(newSeries);
    }, [postGiftTotal, postServiceTotal, postProductTotal]);

    return (
        <div id="chart">
            <ReactApexChart options={state.options} series={series} type="donut" height={165} width={130} />
        </div>
    );
}

export default OrderStatisticsChart;
