import './Live.scss';
import { Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';

function Live() {
    const [listPost, setListPost] = useState([]);
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

    const fecthListPost = async () => {
        try {
            const response = await fetch(
                'https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts?$expand=Gifts&$expand=Products&$expand=Services',
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
                setListPost(responseData.value);
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

    const handleEditClick = (post) => {
        navigate('/details', { state: { post: post } });
    };

    useEffect(() => {
        fecthListPost();
    }, []);

    return (
        <div className="content-wrapper">
            <div className="ontainer-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">Post/</span> List Post
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
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Owner Name</th>
                                        <th>Create Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {listPost.map((post, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{post?.Title}</td>
                                            <td>{post?.Type}</td>
                                            <td>{post?.Owner?.FullName}</td>
                                            <td>{post?.CreateDate.slice(0, 10)}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        post.Status === true ? 'bg-label-success' : 'bg-label-danger'
                                                    } me-1`}
                                                >
                                                    {post.Status === true ? 'Active' : 'InActive'}
                                                </span>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Select Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleEditClick(post)}>
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

export default Live;
