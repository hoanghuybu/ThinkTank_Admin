import './Dashboard.scss';
import { CRow, CCol, CWidgetStatsB, CWidgetStatsF, CCard, CCardBody } from '@coreui/react';
import { CChartPie, CChartBar } from '@coreui/react-chartjs';
import WidgetsDropdown from '~/components/Widget/WidgetsDropdown';
import CIcon from '@coreui/icons-react';
import { cilGamepad, cilSpa } from '@coreui/icons';
import TopGameCard from '~/components/TopGameCard/TopGameCard';

function Dashboard() {
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
                            progress={{ color: 'success', value: 50 }}
                            title="1vs1 Mode"
                            value="50%"
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={4}>
                        <CWidgetStatsB
                            className="mb-4"
                            value="30%"
                            title="Single Mode"
                            progress={{ color: 'info', value: 30 }}
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={4}>
                        <CWidgetStatsB
                            className="mb-4"
                            value="20%"
                            title="Multiplayer Mode"
                            progress={{ color: 'warning', value: 20 }}
                        />
                    </CCol>
                </CRow>
                <div className="w-100 d-flex justify-content-center">
                    <CChartPie
                        data={{
                            labels: ['1vs1 Mode', 'Single Mode', 'Multiplayer Mode'],
                            datasets: [
                                {
                                    data: [50, 30, 20],
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
                    <TopGameCard
                        rank={2}
                        image="https://www.cdmi.in/courses@2x/2D3D-Game-Design.webp"
                        title="Survival Mode"
                        description="Test your endurance in the ultimate survival challenge. How long can you last?"
                    />
                    <TopGameCard
                        rank={1}
                        image="https://www.cdmi.in/courses@2x/2D3D-Game-Design.webp"
                        title="Time Trial Mode"
                        description="Beat the clock in this adrenaline-pumping race against time. Can you set a new record?"
                    />
                    <TopGameCard
                        rank={3}
                        image="https://www.cdmi.in/courses@2x/2D3D-Game-Design.webp"
                        title="Boss Battle Mode"
                        description="Face off against epic bosses in this intense battle for glory and rewards."
                    />
                </div>
            </div>
            <div className="dashboard-summary w-100 my-4 card p-4">
                <div className="w-100 d-flex justify-content-center ">
                    <h1 className="dashboard-title">Summary</h1>
                </div>

                <WidgetsDropdown />
            </div>
            <div className="dashboard-contest w-100 p-4 card">
                <div className="w-100 d-flex justify-content-center">
                    <h1 className="dashboard-title">Contest Summary</h1>
                </div>
                <CRow>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilGamepad} size="xl" />}
                            title="income"
                            value="$1.999,50"
                            color="primary"
                        />
                    </CCol>
                    <CCol xs={12} sm={6} lg={6}>
                        <CWidgetStatsF
                            className="mb-3"
                            icon={<CIcon width={24} icon={cilSpa} size="xl" />}
                            title="income"
                            value="$1.999,50"
                            color="info"
                        />
                    </CCol>
                </CRow>
                <div className="w-100">
                    <CCard className="w-100">
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'GitHub Commits',
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
