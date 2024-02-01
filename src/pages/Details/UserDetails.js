import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import './Details.scss';

function UserDetails() {
    const fullNameRef = useRef();
    const addressRef = useRef();
    const dateOfBirthRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const descriptionRef = useRef();
    const banReasonRef = useRef();
    const [listPostItem, setListPostItem] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [msgFailed, setMsgFailed] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const user = location?.state?.user;

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

    const fetchListPostById = async () => {
        try {
            const response = await fetch(
                `https://beprn231cardogloverodata20231105200328.azurewebsites.net/odata/Posts?$filter=OwnerId eq ${user?.accountId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                },
            );

            if (response.status === 200) {
                const data = await response.json();

                setListPostItem(data.value);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const updatedUser = {
            accountId: user.accountId,
            email: emailRef.current.value,
            fullName: fullNameRef.current.value,
            dateOfBirth: dateOfBirthRef.current.value === '' ? null : dateOfBirthRef.current.value,
            phone: phoneRef.current.value,
            address: addressRef.current.value,
            avatarLink: null,
            description: descriptionRef.current.value,
        };

        try {
            const response = await fetch(
                'https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account/UpdateProfile',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify(updatedUser),
                },
            );
            if (response.status === 200) {
                if (isFailed === true) {
                    setIsFailed(false);
                }
                setIsSuccess(true);
            } else {
                const data = await response.json();
                let errorMessages = [];
                if (data.errors) {
                    if (data.errors.Email) {
                        errorMessages.push(data.errors.Email.join('<br />'));
                    }
                    if (data.errors.FullName) {
                        errorMessages.push(data.errors.FullName.join('<br />'));
                    }
                    if (data.errors.Phone) {
                        errorMessages.push(data.errors.Phone.join('<br />'));
                    }
                } else {
                    errorMessages = ['Unknow error, please connect to admin to support'];
                }
                const combinedErrorMessage = errorMessages.join('<br />');
                setMsgFailed(combinedErrorMessage);
                if (isSuccess === true) {
                    setIsSuccess(false);
                }
                setIsFailed(true);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else if (
                error instanceof SyntaxError &&
                error.message === 'Unexpected token \'E\', "Email are "... is not valid JSON'
            ) {
                setMsgFailed(['Email are already use!']);
                if (isSuccess === true) {
                    setIsSuccess(false);
                }
                setIsFailed(true);
            } else {
                console.log(error);
            }
        }
    };

    const handleUnbanUser = async () => {
        try {
            const response = await fetch(
                `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account/Unban?id=${user.accountId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                },
            );
            if (response.status === 200) {
                setIsSuccess(true);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                const msg = `Error, please contact your administrator for assistance`;
                setMsgFailed(msg);
                setIsFailed(true);
            }
        }
    };

    const handleBanUser = async () => {
        try {
            const response = await fetch(
                `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account/Ban?id=${user.accountId}&reason=${banReasonRef.current.value}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                },
            );
            if (response.status === 200) {
                if (isFailed === true) {
                    setIsFailed(false);
                }
                setIsSuccess(true);
            } else {
                const msg = 'Please input Ban Reason before the Ban';
                setMsgFailed(msg);
                if (isSuccess === true) {
                    setIsSuccess(false);
                }
                setIsFailed(true);
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                await handleRefresh();
            } else {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchListPostById();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listPostItem.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <button
                            className="btn p-0"
                            onClick={() => {
                                navigate('/staff');
                            }}
                            type="button"
                        >
                            <BiArrowBack className="button-details" />
                        </button>
                    </div>
                    <div className="col-auto">
                        <h4 className="fw-bold py-3 mb-4">
                            <span className="text-muted fw-light">User/</span> Details
                        </h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="pb-lg">
                                    <img
                                        className="center-block img img-responsive rounded-circle thumb96"
                                        src={
                                            user.avatarLink
                                                ? user.avatarLink
                                                : 'https://bootdey.com/img/Content/avatar/avatar1.png'
                                        }
                                        alt="Contact"
                                    />
                                </div>
                                <h3 className="m-0 font-weight-bold">{user?.fullName}</h3>
                                <div className="mt-lg">
                                    <div>
                                        <h4>
                                            Phone: <small>{user?.phone}</small>
                                        </h4>
                                        <h4>
                                            Email: <small>{user?.email}</small>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card d-none d-md-block">
                            <div className="card-header text-center">User Post</div>
                            <div className="card-body">
                                {currentItems.map((item, index) => (
                                    <div className="row mb-3" key={index}>
                                        <div className="col-sm-2">
                                            <img
                                                className="media-object rounded-circle thumb48"
                                                src={
                                                    item.Type === 'gift'
                                                        ? 'https://img.freepik.com/free-vector/cartoon-colorful-magic-gift-box-composition_91128-1030.jpg?w=826&t=st=1698229464~exp=1698230064~hmac=807848d8a330ea10b4469674edc7a5e1f33314f8d89156c149129b9231d6ca62'
                                                        : item.Type === 'product'
                                                        ? 'https://cdn-icons-png.flaticon.com/512/5782/5782489.png'
                                                        : item.Type === 'service'
                                                        ? 'https://cdn-icons-png.flaticon.com/512/2105/2105138.png'
                                                        : '../../assets/images/DefaultAvatar.jpg'
                                                }
                                                alt="Contact"
                                            />
                                        </div>
                                        <div className="col-sm-10">
                                            <div className="font-weight-bold">
                                                {item?.Title}
                                                <div className="text-muted">react x{item.NumberOfReact}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <ul className="pagination d-flex justify-content-center">
                                    {Array(Math.ceil(listPostItem.length / itemsPerPage))
                                        .fill()
                                        .map((_, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                            >
                                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-center">User Information</h4>
                                <div className="row pt-lg">
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-10">
                                        <form onSubmit={handleUpdateUser}>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label" htmlFor="basic-default-name">
                                                    Full name
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="basic-default-name"
                                                        defaultValue={user?.fullName}
                                                        ref={fullNameRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-company"
                                                >
                                                    Create Date
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        id="basic-default-company"
                                                        value={user?.createDate}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-company"
                                                >
                                                    Address
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="basic-default-company"
                                                        defaultValue={user?.address}
                                                        ref={addressRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-birthday"
                                                >
                                                    Birthday
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        id="basic-default-birthday"
                                                        defaultValue={user?.dateOfBirth}
                                                        ref={dateOfBirthRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-email"
                                                >
                                                    Email
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group input-group-merge">
                                                        <input
                                                            type="text"
                                                            id="basic-default-email"
                                                            className="form-control"
                                                            defaultValue={user?.email}
                                                            ref={emailRef}
                                                        />
                                                        <span className="input-group-text" id="basic-default-email2">
                                                            @gmail.com
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-phone"
                                                >
                                                    Phone No
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        id="basic-default-phone"
                                                        className="form-control phone-mask"
                                                        defaultValue={user?.phone}
                                                        ref={phoneRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-message"
                                                >
                                                    Description
                                                </label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        id="basic-default-message"
                                                        className="form-control"
                                                        defaultValue={user?.description}
                                                        ref={descriptionRef}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            {user?.banReason && (
                                                <div className="row mb-3">
                                                    <label
                                                        className="col-sm-3 col-form-label"
                                                        htmlFor="basic-default-message"
                                                    >
                                                        Ban Reason
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            id="basic-default-message"
                                                            className="form-control"
                                                            value={user?.banReason}
                                                            readOnly
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-sm-6">
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <hr />
                                                </div>
                                            </div>
                                            <h3>Do you want {user.status ? 'ban' : 'unban'} this user?</h3>
                                            <div className="row ">
                                                {user.status ? (
                                                    <div className="row">
                                                        <div className="row mb-3">
                                                            <label
                                                                className="col-sm-3 col-form-label"
                                                                htmlFor="basic-default-message"
                                                            >
                                                                Input Ban Reason
                                                            </label>
                                                            <div className="col-sm-9">
                                                                <textarea
                                                                    id="basic-default-message"
                                                                    className="form-control"
                                                                    ref={banReasonRef}
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <button
                                                                type="button"
                                                                onClick={handleBanUser}
                                                                className="btn btn-danger"
                                                            >
                                                                Ban
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-sm-6">
                                                        <button
                                                            type="button"
                                                            onClick={handleUnbanUser}
                                                            className="btn btn-success"
                                                        >
                                                            Unban
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                        {isSuccess && (
                                            <h3 style={{ color: '#00AA00' }}>
                                                Update Success please back to list to check
                                            </h3>
                                        )}
                                        {isFailed && (
                                            <h3
                                                style={{ color: '#fe2c55' }}
                                                dangerouslySetInnerHTML={{ __html: msgFailed }}
                                            ></h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;
