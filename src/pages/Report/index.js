import './Report.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';

function Report() {
    const [isLoading, setIsLoading] = useState(true);
    const [listReport, setListReport] = useState([]);
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

    const fecthListReport = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Reports',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                },
            );
            if (response.ok) {
                const responseData = await response.json();
                // console.log(responseData);
                setListReport(responseData.value);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fecthListReport();
    }, []);
    return (
        <div className="content-wrapper">
            <div className="ontainer-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">Report/</span> List Report
                </h4>
                <div className="card">
                    <div className="table-responsive text-nowrap">
                        {isLoading ? (
                            <div className="col-auto d-flex align-items-center justify-content-center">
                                <BallTriangle
                                    height={100}
                                    width={100}
                                    radius={5}
                                    color="rgba(105, 108, 255, 0.85)"
                                    ariaLabel="ball-triangle-loading"
                                    wrapperClass={{}}
                                    wrapperStyle=""
                                    visible={true}
                                />
                            </div>
                        ) : (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Reporter</th>
                                        <th>Reported Person</th>
                                        <th>Content</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {listReport?.map((report, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{report?.Reporter?.Email}</td>
                                            <td>{report?.ReportedPerson?.Email}</td>
                                            <td>{report?.Content}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
