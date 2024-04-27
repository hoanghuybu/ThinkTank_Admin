import images from '~/assets/images';
import './Dashboard.scss';
import { CCard, CCardBody } from '@coreui/react';
import { CChartBar, CChartPie } from '@coreui/react-chartjs';
import { Carousel } from 'react-bootstrap';
import * as dashboardManagement from '~/service/DashboardService';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const listGame = [
    {
        id: 1,
        name: 'Flip Card',
    },
    {
        id: 2,
        name: 'Music Password',
    },
    {
        id: 4,
        name: 'Image Walkthroung',
    },
    {
        id: 5,
        name: 'Find Anonymous',
    },
];

function Dashboard() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const [gameReport, setGameReport] = useState();
    const [contestReport, setContestReport] = useState();
    const [listGames, setListGames] = useState([]);
    const [contestByMonth, setContestByMonth] = useState({});

    useEffect(() => {
        const getGameReport = async () => {
            try {
                const result = await dashboardManagement.getGameReport();
                setGameReport(result);
            } catch (error) {
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                }
                if (error.response.data.errors) {
                    for (let key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            error.response.data.errors[key].forEach((errorMessage) => {
                                const errorString = `${key}: ${errorMessage}`;
                                toast.error(errorString);
                            });
                        }
                    }
                }
            }
        };

        const getContestReport = async () => {
            try {
                const result = await dashboardManagement.getContestReport();
                setContestReport(result);
            } catch (error) {
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                }
                if (error.response.data.errors) {
                    for (let key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            error.response.data.errors[key].forEach((errorMessage) => {
                                const errorString = `${key}: ${errorMessage}`;
                                toast.error(errorString);
                            });
                        }
                    }
                }
            }
        };

        const getListGames = async () => {
            try {
                const result = await dashboardManagement.getListGames();
                const gameSort = result.results.sort((a, b) => b.amoutPlayer - a.amoutPlayer);
                setListGames(gameSort.slice(0, 3));
            } catch (error) {
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                }
                if (error.response.data.errors) {
                    for (let key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            error.response.data.errors[key].forEach((errorMessage) => {
                                const errorString = `${key}: ${errorMessage}`;
                                toast.error(errorString);
                            });
                        }
                    }
                }
            }
        };

        getListGames();
        getGameReport();
        getContestReport();
    }, []);

    useEffect(() => {
        if (contestReport) {
            const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const contestCountsByMonth = {};

            contestReport.contests.forEach((contest) => {
                const startMonth = new Date(contest.startTime).getMonth();
                const endMonth = new Date(contest.endTime).getMonth();

                for (let month = startMonth; month <= endMonth; month++) {
                    const monthName = monthNames[month];
                    contestCountsByMonth[monthName] = (contestCountsByMonth[monthName] || 0) + 1;
                }
            });
            setContestByMonth(contestCountsByMonth);
        }
    }, [contestReport]);
    return (
        <>
            <div className="content-wrapper-dashboard">
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="row">
                        <div className="col-lg-8 mb-4 order-0">
                            <div className="card card-welcome">
                                <div className="d-flex align-items-end row">
                                    <div className="col-sm-12">
                                        <div className="card-body dashboard-banner">
                                            <div className="dashboard-banner-row">
                                                <span className="dashboard-banner-title">
                                                    Welcome to ThinkTank Admin Dashboard
                                                </span>
                                                <span className="dashboard-banner-suptitle">
                                                    Monitor and manage the memory training platform
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 order-1">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-6 mb-4">
                                    <div className="card">
                                        <div className="card-body sumary-card">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <img
                                                        src={images.contestImgIcon}
                                                        alt="chart success"
                                                        className="rounded"
                                                    />
                                                </div>
                                                <small className="text-success fw-semibold">Summary</small>
                                            </div>
                                            <span style={{ fontSize: '20px' }} className="fw-semibold d-block mb-1">
                                                Contest
                                            </span>
                                            <h3 style={{ fontSize: '16px' }} className="card-title fw-normal mb-2">
                                                {gameReport?.totalContest} contest
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-6 mb-4">
                                    <div className="card">
                                        <div className="card-body sumary-card">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <img
                                                        src={images.userImgIcon}
                                                        alt="chart success"
                                                        className="rounded"
                                                    />
                                                </div>
                                                <small className="text-success fw-semibold">Summary</small>
                                            </div>
                                            <span style={{ fontSize: '20px' }} className="fw-semibold d-block mb-1">
                                                User
                                            </span>
                                            <h3 style={{ fontSize: '16px' }} className="card-title fw-normal mb-2">
                                                {gameReport?.totalUser} user
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                            <div className="card contest-summary-wrapper">
                                <div className="row row-bordered g-0">
                                    <div className="col-md-8 contest-sumary-card">
                                        <h3 className="card-header m-0 py-3 text-center fw-bold">Contest Summary</h3>
                                        <div className="w-100 p-4">
                                            <CCard>
                                                <CCardBody>
                                                    {contestByMonth && (
                                                        <CChartBar
                                                            data={{
                                                                labels: Object.keys(contestByMonth),
                                                                datasets: [
                                                                    {
                                                                        label: 'Contest',
                                                                        backgroundColor: '#F07B3F',
                                                                        data: Object.values(contestByMonth),
                                                                    },
                                                                ],
                                                            }}
                                                            labels="months"
                                                        />
                                                    )}
                                                </CCardBody>
                                            </CCard>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h3 className="card-header m-0 py-3 text-center fw-bold"> Top Contests </h3>
                                        {contestReport?.bestContestes &&
                                            contestReport?.bestContestes.map((bestContest, index) => (
                                                <div key={index} className="card-body">
                                                    <div className="card text-center">
                                                        <div
                                                            style={{ fontSize: '18px' }}
                                                            className="card-header fw-semibold"
                                                        >
                                                            Contest Name
                                                        </div>
                                                        <div className="card-body">
                                                            <p style={{ fontSize: '16px' }} className="card-text">
                                                                {bestContest?.nameTopContest}
                                                            </p>
                                                        </div>
                                                        <div className="card-footer text-muted">
                                                            {' '}
                                                            Average Score: {bestContest?.percentAverageScore}{' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                            <div className="row">
                                <div className="col-6 mb-4">
                                    <div className="card">
                                        <div className="card-body sumary-card">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <img
                                                        src={images.roomImgIcon}
                                                        alt="chart success"
                                                        className="rounded"
                                                    />
                                                </div>
                                                <small className="text-success fw-semibold">Summary</small>
                                            </div>
                                            <span style={{ fontSize: '20px' }} className="fw-semibold d-block mb-1">
                                                Room
                                            </span>
                                            <h3 style={{ fontSize: '16px' }} className="card-title fw-normal mb-2">
                                                {gameReport?.totalRoom} room
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-4">
                                    <div className="card">
                                        <div className="card-body sumary-card">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <img
                                                        src={images.userPlusImgIcon}
                                                        alt="chart success"
                                                        className="rounded"
                                                    />
                                                </div>
                                                <small className="text-success fw-semibold">Summary</small>
                                            </div>
                                            <span style={{ fontSize: '20px' }} className="fw-semibold d-block mb-1">
                                                New User
                                            </span>
                                            <h3 style={{ fontSize: '16px' }} className="card-title fw-normal mb-2">
                                                {gameReport?.totalNewbieUser} user
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mb-4">
                                    <div className="card-carousel">
                                        <Carousel
                                            className="h-100"
                                            variant="dark"
                                            activeIndex={index}
                                            onSelect={handleSelect}
                                        >
                                            {listGame.map((item) => (
                                                <Carousel.Item key={item.id}>
                                                    <img
                                                        className="d-block w-100"
                                                        style={{ height: '200px' }}
                                                        src={
                                                            item.id === 1
                                                                ? images.Flipcard
                                                                : item.id === 2
                                                                ? images.MusicPassword
                                                                : item.id === 4
                                                                ? images.ImageWalkThroungh
                                                                : item.id === 5
                                                                ? images.FindAnonymous
                                                                : 'https://via.placeholder.com/290x130'
                                                        }
                                                        alt={item.name}
                                                        height={150}
                                                    />
                                                    <Carousel.Caption>
                                                        <div
                                                            style={{
                                                                backgroundColor: 'rgba(177, 177, 177, 0.6)',
                                                                padding: '10px 15px 10px 15px',
                                                            }}
                                                        >
                                                            <h3
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: '20px',
                                                                    fontWeight: '700',
                                                                }}
                                                            >
                                                                {item?.name}
                                                            </h3>
                                                            <p style={{ color: 'white', fontSize: '16px' }}>
                                                                One game in Think Tank
                                                            </p>
                                                        </div>
                                                    </Carousel.Caption>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-xl-6 order-0 mb-4">
                            <div className="card h-100">
                                <div className="card-header d-flex align-items-center justify-content-center pb-0">
                                    <div className="card-title m-3">
                                        <h3 className="m-0 fw-bold me-2">Game mode</h3>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-center align-items-center mb-3">
                                        <div style={{ width: '80%', height: '70%' }}>
                                            <CChartPie
                                                height={200}
                                                width={200}
                                                data={{
                                                    labels: [
                                                        '1vs1 Mode (%)',
                                                        'Single Mode (%)',
                                                        'Multiplayer Mode (%)',
                                                    ],
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
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-6  mb-4">
                            <div className="card h-100">
                                <div
                                    style={{ height: '80px' }}
                                    className="card-header d-flex align-items-center justify-content-center pb-0"
                                >
                                    <div className="card-title mx-3">
                                        <h3 style={{ fontSize: '25px' }} className="m-0 fw-bold me-2">
                                            Top Game
                                        </h3>
                                    </div>
                                </div>
                                <div style={{ display: 'contents' }} className="card-body w-100 row p-0">
                                    {listGames &&
                                        listGames.map((items, index) => (
                                            <div key={index} style={{ height: '150px' }} className="card w-100 p-0">
                                                <div className="card-body p-0 d-flex row">
                                                    <div
                                                        className={`col-5 book-mark-${
                                                            index + 1
                                                        } h-100 d-flex col align-items-center justify-content-between p-0`}
                                                    >
                                                        <p className="rank-top-game ms-5 mb-0"> Top {index + 1}</p>
                                                        <div className="triangle"></div>
                                                    </div>
                                                    <div className="col-7 p-0 d-flex align-items-center row">
                                                        <h2 className="text-center">{items.name}</h2>
                                                        <p className="text-center">
                                                            {' '}
                                                            {items.amoutPlayer} player was played
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
