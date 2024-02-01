import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import './Details.scss';

function Details() {
    const [listPostItem, setListPostItem] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isFailed, setIsFailed] = useState(false);
    const [msgFailed, setMsgFailed] = useState('');
    const post = location?.state?.post;
    console.log(post);

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

    const handleActivePost = async () => {
        try {
            const response = await fetch(
                `https://beprn231cardogloverodata20231105200328.azurewebsites.net/Posts/Enable/${post.PostId}`,
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

    const handleInactivePost = async () => {
        try {
            const response = await fetch(
                `https://beprn231cardogloverodata20231105200328.azurewebsites.net/Posts/Disable/${post.PostId}`,
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

    useEffect(() => {
        if (post.Type === 'gift') {
            const modifiedGifts = post.Gifts.map((gift) => ({
                ...gift,
                Name: gift.GiftName,
            }));
            setListPostItem(modifiedGifts);
        }
        if (post.Type === 'service') {
            const modifiedServices = post.Services.map((service) => ({
                ...service,
                Name: service.ServiceName,
            }));
            setListPostItem(modifiedServices);
        }
        if (post.Type === 'product') {
            const modifiedProducts = post.Products.map((product) => ({
                ...product,
                Name: product.ProductName,
            }));
            setListPostItem(modifiedProducts);
        }
    }, [post]);

    if (!post) {
        return <div>Không tìm thấy thông tin bài viết.</div>;
    }
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <button
                            className="btn p-0"
                            onClick={() => {
                                navigate('/post');
                            }}
                            type="button"
                        >
                            <BiArrowBack className="button-details" />
                        </button>
                    </div>
                    <div className="col-auto">
                        <h4 className="fw-bold py-3 mb-4">
                            <span className="text-muted fw-light">Post/</span> Details
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
                                            post.Owner.AvatarLink
                                                ? post.Owner.AvatarLink
                                                : 'https://bootdey.com/img/Content/avatar/avatar1.png'
                                        }
                                        alt="Contact"
                                    />
                                </div>
                                <h3 className="m-0 font-weight-bold">{post?.Owner?.FullName}</h3>
                                <div className="mt-lg">
                                    <div>
                                        <h4>
                                            Phone: <small>{post?.Owner?.Phone}</small>
                                        </h4>
                                        <h4>
                                            Email: <small>{post?.Owner?.Email}</small>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card d-none d-md-block">
                            <div className="card-header text-center">{post?.Type}</div>
                            <div className="card-body">
                                {listPostItem.map((item) => (
                                    <div className="row mb-3">
                                        <div className="col-sm-2">
                                            <a href="/#">
                                                <img
                                                    className="media-object rounded-circle thumb48"
                                                    src={
                                                        item.ImageLink
                                                            ? item.ImageLink
                                                            : 'https://img.freepik.com/free-vector/cartoon-colorful-magic-gift-box-composition_91128-1030.jpg?w=826&t=st=1698229464~exp=1698230064~hmac=807848d8a330ea10b4469674edc7a5e1f33314f8d89156c149129b9231d6ca62'
                                                    }
                                                    alt="Contact"
                                                />
                                            </a>
                                        </div>
                                        <div className="col-sm-10">
                                            <div className="font-weight-bold">
                                                <div className="d-flex justify-content-between">
                                                    <div>{item?.Name}</div>
                                                    <div>
                                                        {item?.Price} {item.Price && 'VND'}
                                                    </div>
                                                </div>
                                                <div className="text-muted">{item?.Description}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-center">Post Information</h4>
                                <div className="row pt-lg">
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-10">
                                        <form>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label" htmlFor="basic-default-name">
                                                    Title
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="basic-default-name"
                                                        value={post?.Title}
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
                                                        type="text"
                                                        className="form-control"
                                                        id="basic-default-company"
                                                        value={post?.CreateDate.slice(0, 10)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-email"
                                                >
                                                    Type
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group input-group-merge">
                                                        <input
                                                            type="text"
                                                            id="basic-default-email"
                                                            className="form-control"
                                                            value={post?.Type}
                                                        />
                                                        {/* <span className="input-group-text" id="basic-default-email2">
                                                            @example.com
                                                        </span> */}
                                                    </div>
                                                    {/* <div className="form-text">
                                                        You can use letters, numbers & periods
                                                    </div> */}
                                                </div>
                                            </div>
                                            {/* <div className="row mb-3">
                                                <label
                                                    className="col-sm-2 col-form-label"
                                                    htmlFor="basic-default-phone"
                                                >
                                                    Phone No
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        id="basic-default-phone"
                                                        className="form-control phone-mask"
                                                        placeholder="658 799 8941"
                                                        aria-label="658 799 8941"
                                                        aria-describedby="basic-default-phone"
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-message"
                                                >
                                                    Content
                                                </label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        id="basic-default-message"
                                                        className="form-control"
                                                        value={post?.Content}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <h3>Do you want {post.Status ? 'inactive' : 'active'} this post?</h3>
                                            <div className="row justify-content-center">
                                                {/* <div className="col-sm-6">
                                                    <button type="submit" className="btn btn-primary">
                                                        Update
                                                    </button>
                                                </div> */}
                                                {post.Status ? (
                                                    <div className="col-sm-6">
                                                        <button
                                                            type="button"
                                                            onClick={handleInactivePost}
                                                            className="btn btn-danger"
                                                        >
                                                            InActive
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="col-sm-6">
                                                        <button
                                                            type="button"
                                                            onClick={handleActivePost}
                                                            className="btn btn-success"
                                                        >
                                                            Active
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                        {isSuccess && (
                                            <h3 style={{ color: '#00AA00' }}>
                                                Update Success please back to list to check{' '}
                                            </h3>
                                        )}
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

export default Details;
