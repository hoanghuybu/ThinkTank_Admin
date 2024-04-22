import './Analysis.scss';
import { CChartRadar } from '@coreui/react-chartjs';
import { Progress } from 'rsuite';
import TableCustome from '~/components/TableCustome';
import { BiArrowBack } from 'react-icons/bi';
import * as analysisService from '~/service/AnalysisService';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Analysis() {
    const [accountAnalysis, setAccountAnalysis] = useState();
    const [accountId, setAccountId] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    //API
    const getAccountAnalysis = async () => {
        try {
            const id = parseInt(accountId, 10);
            const result = await analysisService.getAnalysisByAccountId(id);
            setAccountAnalysis(result);
        } catch (error) {
            toast.error('Error:' + error.response.data.error);
            if (error?.response?.data?.error === 'This account is block') {
                navigate('/PlayerManagement');
            }
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setAccountId(searchParams.get('playerId'));
    }, [location]);

    useEffect(() => {
        if (accountId) {
            getAccountAnalysis();
        }
    }, [accountId]);
    return (
        <div className="analysis-container">
            <section className="section about-section gray-bg" id="about">
                <div className="container analysis-container p-5">
                    <div className="w-100">
                        <div className="row justify-content-between">
                            <div className="col-auto">
                                <button
                                    className="btn p-0"
                                    onClick={() => {
                                        window.history.back();
                                    }}
                                    type="button"
                                >
                                    <BiArrowBack className="button-details" />
                                </button>
                            </div>
                            <div className="col-auto">
                                <h4 className="fw-bold py-3 mb-4">
                                    <span className="text-muted fw-light">Player/</span> Analysis
                                </h4>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className="row align-items-center flex-row-reverse ">
                        <div className="col-lg-8">
                            <div className="about-text go-to">
                                <h3 className="dark-color">{accountAnalysis?.account?.fullName}</h3>

                                <div className="row about-list">
                                    <div className="col-md-6">
                                        <div className="media">
                                            <label>Birthday</label>
                                            <p>
                                                {accountAnalysis?.account.dateOfBirth
                                                    ? accountAnalysis.account.dateOfBirth.slice(0, 10)
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="media">
                                            <label>Gender</label>
                                            <p>{accountAnalysis?.account?.gender}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media">
                                            <label>E-mail</label>
                                            <p>{accountAnalysis?.account?.email}</p>
                                        </div>
                                        <div className="media">
                                            <label>User Code</label>
                                            <p>{accountAnalysis?.account?.code}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex justify-content-center">
                            <div className="about-avatar">
                                <img
                                    className="avatar-analysis"
                                    src={
                                        accountAnalysis?.account
                                            ? accountAnalysis?.account?.avatar
                                            : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                                    }
                                    title=""
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="counter">
                        <div className="row">
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="500" data-speed="500">
                                        {accountAnalysis?.totalContest}
                                    </h6>
                                    <p className="m-0px font-w-600">Contest Was Join</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="150" data-speed="150">
                                        {accountAnalysis?.totalLevel}
                                    </h6>
                                    <p className="m-0px font-w-600">Total Level</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="850" data-speed="850">
                                        {accountAnalysis?.totalBadge}
                                    </h6>
                                    <p className="m-0px font-w-600">Archivement</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="190" data-speed="190">
                                        {accountAnalysis?.account?.coin}
                                    </h6>
                                    <p className="m-0px font-w-600">Coin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4">
                        <div className="col-7 col-lg-7">
                            <h1>Analysis</h1>
                            <div className="row">
                                <div className="col-7">
                                    <CChartRadar
                                        data={{
                                            labels: [
                                                'Flipcard',
                                                'Music password',
                                                'Image Walkthroung',
                                                'Find Anonymous',
                                            ],
                                            datasets: [
                                                {
                                                    label: 'Total Level',
                                                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                                    borderColor: 'rgba(151, 187, 205, 1)',
                                                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                                    pointBorderColor: '#fff',
                                                    pointHighlightFill: '#fff',
                                                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                                                    data: [
                                                        accountAnalysis?.percentOfFlipcard,
                                                        accountAnalysis?.percentOfMusicPassword,
                                                        accountAnalysis?.percentOfImagesWalkthrough,
                                                        accountAnalysis?.percentOfFindTheAnonymous,
                                                    ],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                                <div className="col-5 d-flex align-items-center">
                                    <div className="w-100">
                                        <div>
                                            <h4>Flipcard</h4>
                                            <Progress.Line
                                                percent={parseFloat(accountAnalysis?.percentOfFlipcard).toFixed(2)}
                                                strokeColor="#ffc107"
                                            />
                                        </div>
                                        <div>
                                            <h4>Music Password</h4>
                                            <Progress.Line
                                                percent={parseFloat(accountAnalysis?.percentOfMusicPassword).toFixed(2)}
                                                strokeColor="#ffc107"
                                            />
                                        </div>
                                        <div>
                                            <h4>Image WalkThroungh</h4>
                                            <Progress.Line
                                                percent={parseFloat(
                                                    accountAnalysis?.percentOfImagesWalkthrough,
                                                ).toFixed(2)}
                                                strokeColor="#ffc107"
                                            />
                                        </div>
                                        <div>
                                            <h4>FindAnonymous</h4>
                                            <Progress.Line
                                                percent={parseFloat(accountAnalysis?.percentOfFindTheAnonymous).toFixed(
                                                    2,
                                                )}
                                                strokeColor="#ffc107"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-5 col-lg-5">
                            <h1>List Archivement</h1>
                            <div className="w-100">
                                <TableCustome data={accountAnalysis?.listArchievements || []}></TableCustome>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Analysis;
