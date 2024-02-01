import './Home.scss';
import React, { useState, useEffect } from 'react';
import images from '~/assets/images';
import { BiDotsVerticalRounded, BiDollar, BiBox, BiGift } from 'react-icons/bi';
import { GrDocumentImage } from 'react-icons/gr';
import { MdRoomService } from 'react-icons/md';
import DashBoard from '~/components/Dashboard';
import GrowChart from '~/components/Dashboard/GrowChart';
import OrderStatisticsChart from '~/components/Dashboard/OrderStatisticsChart';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [listAccount, setListAccount] = useState([]);
    const [postTotal, setPostTotal] = useState();
    const [postGiftTotal, setPostGiftTotal] = useState();
    const [postServiceTotal, setPostServiceTotal] = useState();
    const [postProductTotal, setPostProductTotal] = useState();
    const [newUserNum, setNewUserNum] = useState();
    const [growPost, setGrowPost] = useState({});
    const navigate = useNavigate();

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
                setListAccount(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    const fetchNewUserNum = async () => {
        try {
            const response = await fetch(
                'https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account/countNewUserToday',
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
                setNewUserNum(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
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
                setGrowPost(responseData);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    const filteredAccounts = listAccount.filter((account) => account.roleId === 3);

    useEffect(() => {
        fecthPostCount();
        fetchListAccount();
        fecthPostGiftCount();
        fecthPostProductCount();
        fecthPostServiceCount();
        fetchNewUserNum();
        fecthDataGrow();
    }, []);
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-lg-8 mb-4 order-0">
                        <div className="card">
                            <div className="d-flex align-items-end row">
                                <div className="col-sm-7">
                                    <div className="card-body">
                                        <h5 className="card-title text-primary">Welcome Staff! 🎉</h5>
                                        <p className="mb-4">
                                            Your Page have <span className="fw-bold">{newUserNum}</span> new user today.
                                            Check post and user.
                                        </p>
                                    </div>
                                </div>

                                <div className="col-sm-5 text-center text-sm-left">
                                    <div className="card-body pb-0 px-0 px-md-4">
                                        <img src={images.CDLP_logo} height="140" width="100%" alt="CDLP logo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 order-1">
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img
                                                    src={images.chartSuccess}
                                                    alt="chart success"
                                                    className="rounded"
                                                />
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <BiDotsVerticalRounded />
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="/">
                                                        View More
                                                    </a>
                                                    <a className="dropdown-item" href="/">
                                                        Delete
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">Post</span>
                                        <h3 className="card-title mb-2">{postTotal} post</h3>
                                        {/* <small className="text-success fw-semibold">
                                            <BiUpArrowAlt /> +72.80%
                                        </small> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img src={images.walletInfo} alt="chart success" className="rounded" />
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <BiDotsVerticalRounded />
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="/">
                                                        View More
                                                    </a>
                                                    <a className="dropdown-item" href="/">
                                                        Delete
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">User</span>
                                        <h3 className="card-title mb-2">{filteredAccounts.length} user</h3>
                                        {/* <small className="text-success fw-semibold">
                                            <BiUpArrowAlt /> +28.42%
                                        </small> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-12 order-2 order-md-3 order-lg-2 mb-4">
                        <div className="card">
                            <div className="row row-bordered g-0">
                                <div className="col-md-8">
                                    <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                                    <DashBoard />
                                </div>
                                <div className="col-md-4">
                                    <div className="card-body d-flex justify-content-center fw-bold">
                                        Report Post Today
                                    </div>
                                    <GrowChart />
                                    <div className="text-center fw-semibold pt-3 mb-2"> Post today</div>
                                    <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-around">
                                        <div className="d-flex">
                                            <div className="me-2">
                                                <span className="badge bg-label-primary p-2">
                                                    <GrDocumentImage className="text-primary" />
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>Today</small>
                                                <h6 className="mb-0">{growPost.postToday} post</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="me-2">
                                                <span className="badge bg-label-primary p-2">
                                                    <GrDocumentImage className="text-primary" />
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>Total</small>
                                                <h6 className="mb-0">{growPost.postTotal} post</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8 col-lg-12  order-3 order-md-2">
                        <div className="card h-100">
                            <div className="card-header  pb-0">
                                <div className="card-title d-flex align-items-center justify-content-between mb-0">
                                    <h5 className="m-0 me-2">Post Statistics</h5>
                                    <small className="text-muted">{postTotal} Total post</small>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <h2 className="mb-2">{postTotal}</h2>
                                        <span>Total Posts</span>
                                    </div>
                                    <OrderStatisticsChart />
                                </div>
                                <ul className="p-0 m-0">
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-primary">
                                                <BiGift />
                                            </span>
                                        </div>
                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-start gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Type</h6>
                                                <small className="text-muted">Gift</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">{postGiftTotal} post</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-success">
                                                <BiBox />
                                            </span>
                                        </div>
                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-start gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Type</h6>
                                                <small className="text-muted">Product</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">{postProductTotal} post</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-info">
                                                <MdRoomService />
                                            </span>
                                        </div>
                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-start gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Type</h6>
                                                <small className="text-muted">Service</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">{postServiceTotal} post</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
