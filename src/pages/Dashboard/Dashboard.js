import './Dashboard.scss';
import { CRow, CCol, CWidgetStatsB, CWidgetStatsF, CCard, CCardBody } from '@coreui/react';
import { CChartPie, CChartBar } from '@coreui/react-chartjs';
import WidgetsDropdown from '~/components/Widget/WidgetsDropdown';
import CIcon from '@coreui/icons-react';
import { cilUser, cilPuzzle, cilHome, cilUserPlus } from '@coreui/icons';
import TopGameCard from '~/components/TopGameCard/TopGameCard';
import * as dashboardManagement from '~/service/DashboardService';
import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [listGames, setListGames] = useState([]);
    const [gameReport, setGameReport] = useState();

    const getListGames = async () => {
        try {
            const result = await dashboardManagement.getListGames();
            const gameSort = result.results.sort((a, b) => b.amoutPlayer - a.amoutPlayer);
            setListGames(gameSort.slice(0, 3));
        } catch (error) {
            console.log(error);
        }
    };

    const getGameReport = async () => {
        try {
            const result = await dashboardManagement.getGameReport();
            setGameReport(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getListGames();
        getGameReport();
    }, []);
    return (
        <div className="dashboard-container">
            <div className="dashboard-banner w-100 d-flex justify-content-center my-4">
                <div className="dashboard-banner-row">
                    <span className="dashboard-banner-title">Welcome to ThinkTank Admin Dashboard</span>
                </div>
                <span className="dashboard-banner-suptitle">Monitor and manage the memory training platform</span>
            </div>
            <div className="dashboard-game-mode w-100 my-4 card p-4">
                <div className="w-100 d-flex justify-content-center">
                    <h1 className="dashboard-title">Game Mode Summary</h1>
                </div>
                <CRow>
                    <CCol xs={12} sm={6} lg={4}>
                        <CWidgetStatsB
                            className="mb-4"
                            progress={{ color: 'success', value: gameReport?.total1vs1Mode }}
                            title="1vs1 Mode"
                            value={`${gameReport?.total1vs1Mode}%`}
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={4}>
                        <CWidgetStatsB
                            className="mb-4"
                            value={`${gameReport?.totalSinglePlayerMode}%`}
                            title="Single Mode"
                            progress={{ color: 'info', value: gameReport?.totalSinglePlayerMode }}
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={4}>
                        <CWidgetStatsB
                            className="mb-4"
                            value={`${gameReport?.totalMultiplayerMode}%`}
                            title="Multiplayer Mode"
                            progress={{ color: 'warning', value: gameReport?.totalMultiplayerMode }}
                        />
                    </CCol>
                </CRow>
                <div className="w-100 d-flex justify-content-center">
                    <CChartPie
                        data={{
                            labels: ['1vs1 Mode', 'Single Mode', 'Multiplayer Mode'],
                            datasets: [
                                {
                                    data: [
                                        gameReport?.total1vs1Mode,
                                        gameReport?.totalSinglePlayerMode,
                                        gameReport?.totalMultiplayerMode,
                                    ],
                                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                },
                            ],
                        }}
                    />
                </div>
            </div>
            <div className="dashboard-top-game w-100 my-4 card p-4">
                <div className="w-100 d-flex justify-content-center">
                    <h1 className="dashboard-title">Top Game</h1>
                </div>
                <div className="list-card-game">
                    {listGames.map((game, index) => (
                        <TopGameCard
                            key={game.id}
                            rank={index + 1}
                            gameId={game.id}
                            title={game.name}
                            description={`${game.amoutPlayer} Player was played`}
                        />
                    ))}
                </div>
            </div>
            <div className="dashboard-summary w-100 my-4 card p-4">
                <div className="w-100 d-flex justify-content-center ">
                    <h1 className="dashboard-title">Summary</h1>
                </div>

                <CRow>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilPuzzle} size="xl" />}
                            title="Contest"
                            value={gameReport?.totalContest}
                            color="primary"
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilUser} size="xl" />}
                            title="User"
                            value={gameReport?.totalUser}
                            color="info"
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilHome} size="xl" />}
                            title="Room"
                            value={gameReport?.totalRoom}
                            color="warning"
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilUserPlus} size="xl" />}
                            title="New User"
                            value={gameReport?.totalNewbieUser}
                            color="danger"
                        />
                    </CCol>
                </CRow>
            </div>
            <div className="dashboard-contest w-100 p-4 card">
                <div className="w-100 d-flex justify-content-center">
                    <h1 className="dashboard-title">Contest Summary</h1>
                </div>
                <WidgetsDropdown />
                <div className="w-100">
                    <CCard className="w-100">
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'Contest',
                                            backgroundColor: '#f87979',
                                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                                        },
                                    ],
                                }}
                                labels="months"
                            />
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
