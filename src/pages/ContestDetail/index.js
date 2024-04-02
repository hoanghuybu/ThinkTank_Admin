import { useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { FaCameraRetro, FaMusic } from 'react-icons/fa';
import { HiXMark } from 'react-icons/hi2';
import React, { useEffect, useState, useRef } from 'react';
import * as contestService from '~/service/ContestService';
import { Uploader } from 'rsuite';
import './ContestDetail.scss';
import { toast } from 'react-toastify';

function ContestDetail() {
    const nameContestRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const coinBettingRef = useRef();
    const playTimeRef = useRef();
    const location = useLocation();
    const [contest, setContest] = useState(location.state.contest);
    const [listImageURL, setListImageURL] = useState([]);
    const [thumnailURL, setThumnailURL] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const toastId = React.useRef(null);

    //handle toast noti
    const notifyToast = () => (toastId.current = toast('In process, please wait ...', { autoClose: false }));

    const updateToast = () =>
        toast.update(toastId.current, {
            render: 'Update succes',
            type: 'success',
            autoClose: 5000,
        });

    //handle paginate asset contest

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = contest.assetOfContests.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // handle update contest thumnail

    const handleUploadThumnailSuccess = (response) => {
        const startIndex = response[0].lastIndexOf('%2F') + 3;
        const endIndex = response[0].indexOf('?');
        const fileName = response[0].substring(startIndex, endIndex);
        setThumnailURL({ name: fileName, url: response[0] });
    };

    const handleRemoveThumnailFile = (file) => {
        setThumnailURL((prevListImageURL) => prevListImageURL.filter((item) => item.name !== file.name));
    };

    //handle upload contest

    const handleUploadSuccess = (response) => {
        const startIndex = response[0].lastIndexOf('%2F') + 3;
        const endIndex = response[0].indexOf('?');
        const fileName = response[0].substring(startIndex, endIndex);
        setListImageURL((prevListImageURL) => [...prevListImageURL, { name: fileName, url: response[0] }]);
    };

    const handleRemoveFile = (file) => {
        setListImageURL((prevListImageURL) => prevListImageURL.filter((item) => item.name !== file.name));
    };

    // handle delete asset
    const handleRemoveAsset = (assetId) => {
        const updatedAssets = contest.assetOfContests.filter((asset) => asset.id !== assetId);

        setContest((prevContest) => ({
            ...prevContest,
            assetOfContests: updatedAssets,
        }));
    };

    //API
    const handleUpdateContest = async (e) => {
        e.preventDefault();

        notifyToast();
        let updatedAssets = [];
        let updatedAssets1 = [];
        let updatedAssets2 = [];
        if (contest.assetOfContests) {
            if (contest.gameId === 1) {
                updatedAssets1 = contest.assetOfContests.map((asset) => ({
                    value: asset.value,
                    typeOfAssetId: 3,
                }));
            } else if (contest.gameId === 2) {
                updatedAssets1 = contest.assetOfContests.map((asset) => ({
                    value: asset.value,
                    typeOfAssetId: 5,
                }));
            } else if (contest.gameId === 4) {
                updatedAssets1 = contest.assetOfContests.map((asset) => ({
                    value: asset.value,
                    typeOfAssetId: 3,
                }));
            } else if (contest.gameId === 5) {
                updatedAssets1 = contest.assetOfContests.map((asset) => ({
                    value: asset.value,
                    typeOfAssetId: 4,
                }));
            }
        }

        if (listImageURL) {
            if (contest.gameId === 1) {
                updatedAssets2 = listImageURL.map((asset) => ({
                    value: asset.url,
                    typeOfAssetId: 3,
                }));
            } else if (contest.gameId === 2) {
                updatedAssets2 = listImageURL.map((asset) => ({
                    value: asset.url,
                    typeOfAssetId: 5,
                }));
            } else if (contest.gameId === 4) {
                updatedAssets2 = listImageURL.map((asset) => ({
                    value: asset.url,
                    typeOfAssetId: 3,
                }));
            } else if (contest.gameId === 5) {
                updatedAssets2 = listImageURL.map((asset) => ({
                    value: asset.url,
                    typeOfAssetId: 4,
                }));
            }
        }

        if (updatedAssets1.length > 0) {
            updatedAssets.push(...updatedAssets1);
        }
        if (updatedAssets2.length > 0) {
            updatedAssets.push(...updatedAssets2);
        }

        const formSubmit = {
            name: nameContestRef.current.value,
            thumbnail: thumnailURL?.url,
            startTime: startTimeRef.current.value,
            endTime: endTimeRef.current.value,
            coinBetting: coinBettingRef.current.value,
            gameId: contest?.gameId,
            playTime: playTimeRef.current.value,
            assets: updatedAssets,
        };
        try {
            const response = await contestService.updateContest(formSubmit, contest.id);

            if (response) {
                updateToast();
            }
        } catch (error) {
            if (error.response) {
                toast.dismiss(toastId.current);
                toast.error(error.response.data.error);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    };

    console.log(contest);
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
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
                            <span className="text-muted fw-light">Contest/</span> Detail
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
                                            contest.thumbnail
                                                ? contest.thumbnail
                                                : 'https://bootdey.com/img/Content/avatar/avatar1.png'
                                        }
                                        alt="Contact"
                                    />
                                </div>
                                <h3 className="m-0 font-weight-bold">{contest?.name}</h3>
                                <div className="mt-lg">
                                    <div>
                                        <h4>
                                            Amount Player: <small>{contest?.amoutPlayer}</small>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card d-none d-md-block">
                            <div className="card-header text-center">Contest Asset</div>
                            <div className="card-body">
                                {currentItems.map((item, index) => (
                                    <div className="row mb-3" key={index}>
                                        <div className="col-sm-2">
                                            <img
                                                className="media-object rounded-circle thumb48"
                                                src={
                                                    item.value
                                                        ? item.value
                                                        : 'https://cdn-icons-png.flaticon.com/512/2105/2105138.png'
                                                }
                                                alt="Contest"
                                            />
                                        </div>
                                        <div className="col-sm-8">
                                            <div className="font-weight-bold">
                                                Asset {item?.id}
                                                <div className="text-muted">{item?.type}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-2 d-flex align-items-center">
                                            <button
                                                onClick={() => handleRemoveAsset(item.id)}
                                                className="btn p-0 "
                                                type="button"
                                            >
                                                <HiXMark className="button-details" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <ul className="pagination d-flex justify-content-center">
                                    {Array(Math.ceil(contest.assetOfContests.length / itemsPerPage))
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
                                <div className="col-sm-12">
                                    <hr />
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor="field3" className="form-label">
                                        Add more Contest Game Asset
                                    </label>
                                    <div>
                                        <Uploader
                                            multiple
                                            listType="picture"
                                            onSuccess={handleUploadSuccess}
                                            onRemove={handleRemoveFile}
                                            action={`https://thinktank-sep490.azurewebsites.net/api/files/contests?type=${
                                                contest?.gameId === 1
                                                    ? '3'
                                                    : contest?.gameId === 2
                                                    ? '2'
                                                    : contest?.gameId === 4
                                                    ? '4'
                                                    : contest?.gameId === 5
                                                    ? '1'
                                                    : ''
                                            }`}
                                            // draggable
                                        >
                                            <div>{contest?.gameId === 2 ? <FaMusic /> : <FaCameraRetro />}</div>
                                        </Uploader>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-center">Contest Information</h4>
                                <div className="row pt-lg">
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-10">
                                        <form onSubmit={handleUpdateContest}>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label" htmlFor="basic-default-name">
                                                    Contest Name
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="basic-default-name"
                                                        defaultValue={contest?.name}
                                                        ref={nameContestRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-company"
                                                >
                                                    Start Time
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        id="basic-default-company"
                                                        defaultValue={contest?.startTime}
                                                        ref={startTimeRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-company"
                                                >
                                                    End Time
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        id="basic-default-company"
                                                        defaultValue={contest?.endTime}
                                                        ref={endTimeRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Game Name</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={contest?.gameName}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-phone"
                                                >
                                                    Coin Betting
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="number"
                                                        className="form-control phone-mask"
                                                        defaultValue={contest?.coinBetting}
                                                        ref={coinBettingRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-phone"
                                                >
                                                    Play Time
                                                </label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="number"
                                                        className="form-control phone-mask"
                                                        defaultValue={contest?.playTime}
                                                        ref={playTimeRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label
                                                    className="col-sm-3 col-form-label"
                                                    htmlFor="basic-default-message"
                                                >
                                                    Thumnail
                                                </label>
                                                <div className="col-sm-9">
                                                    <Uploader
                                                        listType="picture-text"
                                                        onSuccess={handleUploadThumnailSuccess}
                                                        onRemove={handleRemoveThumnailFile}
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/contests?type=${
                                                            contest?.gameId === 1
                                                                ? '3'
                                                                : contest?.gameId === 2
                                                                ? '2'
                                                                : contest?.gameId === 4
                                                                ? '4'
                                                                : contest?.gameId === 5
                                                                ? '1'
                                                                : ''
                                                        }`}
                                                        draggable
                                                    >
                                                        <div
                                                            style={{
                                                                height: 200,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <span>
                                                                Click or Drag files to this area to upload with gameid:
                                                            </span>
                                                        </div>
                                                    </Uploader>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
                                            </div>
                                        </form>
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

export default ContestDetail;
