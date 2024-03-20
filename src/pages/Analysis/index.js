import './Analysis.scss';
import { CChartRadar } from '@coreui/react-chartjs';
import { Progress } from 'rsuite';
import TableCustome from '~/components/TableCustome';
import { BiArrowBack } from 'react-icons/bi';

function Analysis() {
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
                                <h3 className="dark-color">User Name </h3>

                                <div className="row about-list">
                                    <div className="col-md-6">
                                        <div className="media">
                                            <label>Birthday</label>
                                            <p>4th april 1998</p>
                                        </div>
                                        <div className="media">
                                            <label>Age</label>
                                            <p>22 Yr</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media">
                                            <label>E-mail</label>
                                            <p>info@domain.com</p>
                                        </div>
                                        <div className="media">
                                            <label>Address</label>
                                            <p>California, USA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex justify-content-center">
                            <div className="about-avatar">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" title="" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="counter">
                        <div className="row">
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="500" data-speed="500">
                                        500
                                    </h6>
                                    <p className="m-0px font-w-600">Contest Was Join</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="150" data-speed="150">
                                        150
                                    </h6>
                                    <p className="m-0px font-w-600">Hour Was Played</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="850" data-speed="850">
                                        850
                                    </h6>
                                    <p className="m-0px font-w-600">Archivement</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="count-data text-center">
                                    <h6 className="count h2" data-to="190" data-speed="190">
                                        190
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
                                <div className="col-8">
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
                                                    label: 'Hour Was Played',
                                                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                                    borderColor: 'rgba(151, 187, 205, 1)',
                                                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                                    pointBorderColor: '#fff',
                                                    pointHighlightFill: '#fff',
                                                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                                                    data: [28, 48, 40, 19],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                                <div className="col-4 d-flex align-items-center">
                                    <div className="w-100">
                                        <div>
                                            <h4>Flipcard</h4>
                                            <Progress.Line percent={28} strokeColor="#ffc107" />
                                        </div>
                                        <div>
                                            <h4>Music Password</h4>
                                            <Progress.Line percent={48} strokeColor="#ffc107" />
                                        </div>
                                        <div>
                                            <h4>Flipcard</h4>
                                            <Progress.Line percent={40} strokeColor="#ffc107" />
                                        </div>
                                        <div>
                                            <h4>Flipcard</h4>
                                            <Progress.Line percent={19} strokeColor="#ffc107" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-5 col-lg-5">
                            <h1>List Archivement</h1>
                            <div className="w-100">
                                <TableCustome></TableCustome>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Analysis;
