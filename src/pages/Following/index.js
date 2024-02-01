import './Following.scss';
import { Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';

function Following() {
    const [listAccount, setListAccount] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
                setListAccount(filteredAccounts);
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

    const handleEditClick = (user) => {
        navigate('/UserDetails', { state: { user: user } });
    };

    useEffect(() => {
        fetchListAccount();
    }, []);

    return (
        <div className="content-wrapper">
            <div className="ontainer-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">Staff/</span> List User
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
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Create Day</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {listAccount?.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user?.createDate.slice(0, 10)}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.status === true ? 'bg-label-success' : 'bg-label-danger'
                                                    } me-1`}
                                                >
                                                    {user.status === true ? 'Active' : 'InActive'}
                                                </span>
                                            </td>

                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Select Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleEditClick(user)}>
                                                            Edit
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
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

export default Following;
