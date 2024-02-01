import { useState, useEffect, useRef } from 'react';
import { BiArrowBack, BiLogoGmail, BiSolidPhone } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

function Profile() {
    const fullNameRef = useRef();
    const addressRef = useRef();
    const dateOfBirthRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const descriptionRef = useRef();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [msgFailed, setMsgFailed] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState('');

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

    const handlePreviewAvatar = (e) => {
        const file = e.target.files[0];
        if (e.target.files.length !== 0) {
            file.preview = URL.createObjectURL(file);
            setAvatar(file);
        }
    };

    const fetchUserById = async () => {
        const userId = sessionStorage.getItem('accountId');

        try {
            const response = await fetch(
                `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Account/${userId}`,
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
                setUser(data);
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
                setIsSuccess(true);
                const data = await response.json();
                setUser(data);
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

    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('file', avatar);
            const response = await fetch(
                'https://beprn231catdoglover20231105200231.azurewebsites.net/api/FireBase/UploadImageFile',
                {
                    method: 'POST',
                    body: formData,
                },
            );
            if (response.status === 200) {
                const results = await response.text();
                const updatedUser = {
                    accountId: user.accountId,
                    email: emailRef.current.value,
                    fullName: fullNameRef.current.value,
                    dateOfBirth: dateOfBirthRef.current.value === '' ? null : dateOfBirthRef.current.value,
                    phone: phoneRef.current.value,
                    address: addressRef.current.value,
                    avatarLink: results,
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
                        setUploadSuccess(true);
                        const data = await response.json();
                        setUser(data);
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    useEffect(() => {
        fetchUserById();
    }, []);
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
                            <span className="text-muted fw-light">User/</span> Profile
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
                                            avatar && avatar.preview
                                                ? avatar.preview
                                                : user && user.avatarLink
                                                ? user.avatarLink
                                                : 'https://bootdey.com/img/Content/avatar/avatar1.png'
                                        }
                                        alt="Contact"
                                    />
                                </div>
                                <h3 className="m-0 font-weight-bold">{user?.fullName}</h3>
                                <div className="mt-lg">
                                    <div className="mb-3 mt-2">
                                        <input type="file" onChange={handlePreviewAvatar} className="form-control" />
                                    </div>
                                    <div className="mb-1">
                                        <button onClick={uploadImage} className="btn btn-outline-success">
                                            Upload Image
                                        </button>
                                    </div>
                                    {uploadSuccess && <h3 style={{ color: '#00AA00' }}>Update Success</h3>}
                                    {isFailed && <h3 style={{ color: '#fe2c55' }}>{msgFailed}</h3>}
                                </div>
                            </div>
                        </div>
                        <div className="card d-none d-md-block">
                            <div className="card-header text-center">User Post</div>
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-sm-2">
                                        <BiLogoGmail className="media-object rounded-circle thumb48" />
                                    </div>
                                    <div className="col-sm-10 d-flex align-items-center">
                                        <div className="font-weight-bold pl-2">{user?.email}</div>
                                    </div>
                                    <div className="col-sm-2">
                                        <BiSolidPhone className="media-object rounded-circle thumb48" />
                                    </div>
                                    <div className="col-sm-10 d-flex align-items-center">
                                        <div className="font-weight-bold pl-2">{user?.phone}</div>
                                    </div>
                                </div>
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

                                            <div className="col-sm-6">
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                        {isSuccess && <h3 style={{ color: '#00AA00' }}>Update Success</h3>}
                                        {isFailed && <h3 style={{ color: '#fe2c55' }}>{msgFailed}</h3>}
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

export default Profile;
