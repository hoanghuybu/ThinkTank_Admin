import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

function DashBoard() {
    const [accountTotal, setAccountTotal] = useState();
    const [postTotal, setPostTotal] = useState();
    const [series, setSeries] = useState([{ data: [10, 19] }]);
    const navigate = useNavigate();

    const colors = ['#03C3EC', '#71DD37'];

    var state = {
        series: [
            {
                data: [10, 19],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    },
                },
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            xaxis: {
                categories: [
                    ['User', ' Account'],
                    ['Post', ' '],
                ],
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px',
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

    const fecthPostCount = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts/$count',
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
                setPostTotal(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    const fetchListAccount = async () => {
        try {
            const response = await fetch('https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
            });
            if (response.status === 200) {
                const responseData = await response.json();
                const filteredAccounts = responseData.filter((account) => account.roleId === 3);
                const numberOfItems = filteredAccounts.length;
                setAccountTotal(numberOfItems);
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
        fecthPostCount();
        fetchListAccount();
    }, []);
    useEffect(() => {
        const newSeries = [{ data: [accountTotal, postTotal] }];
        setSeries(newSeries);
    }, [postTotal, accountTotal]);

    return (
        <div>
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <ReactApexChart options={state.options} series={series} type="bar" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
