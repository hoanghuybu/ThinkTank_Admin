import { CRow, CCol, CWidgetStatsA } from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';

import React, { useEffect, useState } from 'react';
import * as dashboardManagement from '~/service/DashboardService';

const WidgetsDropdown = () => {
    const [contestReport, setContestReport] = useState();

    const getContestReport = async () => {
        try {
            const result = await dashboardManagement.getContestReport();
            setContestReport(result);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(contestReport);
    useEffect(() => {
        getContestReport();
    });
    return (
        <CRow>
            <CCol sm={6} lg={6}>
                <CWidgetStatsA
                    className="mb-4"
                    color="primary"
                    value={<>Top contest </>}
                    title={contestReport?.nameTopContest}
                    chart={
                        <CChartLine
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                datasets: [
                                    {
                                        label: 'My First dataset',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-primary'),
                                        data: [65, 59, 84, 84, 51, 55, 40],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        min: 30,
                                        max: 89,
                                        display: false,
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 1,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} lg={6}>
                <CWidgetStatsA
                    className="mb-4"
                    color="info"
                    value={<>Average Score </>}
                    title={contestReport?.percentAverageScore}
                    chart={
                        <CChartLine
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                datasets: [
                                    {
                                        label: 'My First dataset',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-info'),
                                        data: [1, 18, 9, 17, 34, 22, 11],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        min: -9,
                                        max: 39,
                                        display: false,
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 1,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
        </CRow>
    );
};

export default WidgetsDropdown;
