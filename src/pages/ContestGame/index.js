import './ContestGame.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCameraRetro, FaMusic } from 'react-icons/fa';
import * as contestService from '~/service/ContestService';
import { toast } from 'react-toastify';
import { Table, Pagination, DOMHelper, Uploader } from 'rsuite';
import { Button as RsuiteButton } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const CompactCell = (props) => <Cell {...props} style={{ padding: 6 }} />;

const ImageCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 3 }}>
        <div
            style={{
                width: 150,
                height: 80,
                background: '#f5f5f5',
                borderRadius: 6,
                overflow: 'hidden',
                display: 'inline-block',
            }}
        >
            <img
                alt="user avatar"
                src={rowData.thumbnail ? rowData.thumbnail : 'https://via.placeholder.com/40x40'}
                width="150"
            />
        </div>
    </Cell>
);

const { getHeight } = DOMHelper;

function ContestGame() {
    const [currentStep, setCurrentStep] = useState(1);
    const [listContests, setListContest] = useState([]);
    const [listImageURL, setListImageURL] = useState([]);
    const [gameId, setGameId] = useState();
    const [thumnailURL, setThumnailURL] = useState();
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [coinBetting, setCoinBetting] = useState('');
    const [playTime, setPlayTime] = useState();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');
    const toastId = React.useRef(null);
    const navigate = useNavigate();

    //Toast
    const notifyToast = () => (toastId.current = toast('In process, please wait ...', { autoClose: false }));

    const updateToast = () =>
        toast.update(toastId.current, {
            render: 'Create success',
            type: 'success',
            autoClose: 5000,
        });

    //handle modal
    const handleClose = () => {
        handleResetData();
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const isStepDataValid = () => {
        switch (currentStep) {
            case 1:
                return name !== '' && thumnailURL !== null && thumnailURL !== undefined;
            case 2:
                return startTime !== '' && endTime !== '' && coinBetting !== '' && playTime !== '';
            case 3:
                return listImageURL.length > 0;
            case 4:
                const allObjectsHaveDescription = listImageURL.every((obj) => obj.hasOwnProperty('description'));

                return allObjectsHaveDescription;
            default:
                return false;
        }
    };

    //handle multi step form

    const nextStep = () => {
        if (isStepDataValid()) {
            setCurrentStep(currentStep + 1);
            updateProgressBar();
        } else {
            toast.info('Please all items in this step before going to the next step.');
            return;
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            updateProgressBar();
        }
    };

    const updateProgressBar = () => {
        const progressPercentage = ((currentStep - 1) / 2) * 100;
        return { width: progressPercentage + '%' };
    };

    const nextFourStep = () => {
        if (isStepDataValid()) {
            setCurrentStep(currentStep + 1);
            updateFourProgressBar();
        } else {
            toast.info('Please add at least one item to the list before proceeding.');
            return;
        }
    };

    const prevFourStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            updateFourProgressBar();
        }
    };

    const updateFourProgressBar = () => {
        const progressPercentage = ((currentStep - 1) / 3) * 100;
        return { width: progressPercentage + '%' };
    };

    //handle upload contest
    const acceptValue = gameId === '1' || gameId === '3' || gameId === '4' || gameId === '5' ? 'image/*' : 'audio/*';

    const handleResetData = () => {
        setName('');
        setStartTime('');
        setEndTime('');
        setCoinBetting('');
        setPlayTime('');
        setListImageURL([]);
        setThumnailURL({});
        setCurrentStep(1);
    };

    const handleUploadSuccess = (response) => {
        const startIndex = response[0].lastIndexOf('%2F') + 3;
        const endIndex = response[0].indexOf('?');
        const fileName = response[0].substring(startIndex, endIndex);
        setListImageURL((prevListImageURL) => [...prevListImageURL, { name: fileName, url: response[0] }]);
    };

    const handleRemoveFile = (file) => {
        setListImageURL((prevListImageURL) => prevListImageURL.filter((item) => item.name !== file.name));
    };

    const handleUploadThumnailSuccess = (response) => {
        const startIndex = response[0].lastIndexOf('%2F') + 3;
        const endIndex = response[0].indexOf('?');
        const fileName = response[0].substring(startIndex, endIndex);
        setThumnailURL({ name: fileName, url: response[0] });
    };

    const handleRemoveThumnailFile = () => {
        setThumnailURL();
    };

    //handle value for game find anonymous
    const handleDescriptionChange = (index, description) => {
        const updatedImageList = [...listImageURL];
        updatedImageList[index] = { ...updatedImageList[index], description };
        setListImageURL(updatedImageList);
    };

    //handle view detail contest
    const handleViewClick = (item) => {
        navigate('/Contest/ContestDetail', { state: { contest: item } });
    };

    //handle table contest
    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    const handleChangeLimit = (dataKey) => {
        setPage(1);
        setLimit(dataKey);
    };

    const getFilteredData = () => {
        let sortedData = listContests;
        if (sortedData) {
            sortedData = sortedData.filter((item) => {
                if (!item.name.includes(searchKeyword)) {
                    return false;
                }

                return true;
            });
        }
        if (sortColumn && sortType) {
            sortedData = sortedData.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }

        return sortedData;
    };

    const data = getFilteredData().filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

    //API

    const getListContest = async () => {
        setLoading(true);
        try {
            const id = parseInt(gameId, 10);
            const result = await contestService.getListContestByGameID(null, null, id, 1);
            if (result) {
                setLoading(false);
                setListContest(result.results);
            }
        } catch (error) {
            toast.error('Error:' + error);
        }
    };

    const handleDeleteContest = async (id) => {
        setLoading(true);
        try {
            const result = await contestService.deleteContest(id);
            if (result) {
                await getListContest().then(setLoading(false));
            }
        } catch (error) {
            toast.error('Error:' + error.response.data.error);
            setLoading(false);
        }
    };

    const handleContestSubmit = async (e) => {
        e.preventDefault();

        if (gameId === '5') {
            if (currentStep < 4) {
                e.preventDefault();
                nextFourStep();
            } else {
                e.preventDefault();

                if (!isStepDataValid()) {
                    toast.info('Please all items in this step before going to the next step.');
                    return;
                }
                notifyToast();
                const gameIdNumber = parseInt(gameId, 10);
                const playTimeNumber = parseInt(playTime, 10);
                let newAssets = [];
                if (gameIdNumber === 1 || gameIdNumber === 4) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: image.url,
                            contestId: 0,
                            typeOfAssetId: 3,
                        });
                    });
                } else if (gameIdNumber === 2) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: image.url,
                            contestId: 0,
                            typeOfAssetId: 5,
                        });
                    });
                } else if (gameIdNumber === 5) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: `${image.description};${image.url}`,
                            contestId: 0,
                            typeOfAssetId: 4,
                        });
                    });
                }

                const formSubmit = {
                    name: name,
                    thumbnail: thumnailURL.url,
                    startTime: startTime,
                    endTime: endTime,
                    coinBetting: coinBetting,
                    gameId: gameIdNumber,
                    playTime: playTimeNumber,
                    assets: newAssets,
                };

                try {
                    const response = await contestService.createContest(formSubmit);

                    if (response) {
                        updateToast();
                        await getListContest().then(handleResetData);
                    }
                } catch (error) {
                    if (error.response) {
                        toast.dismiss(toastId.current);
                        toast.error(error.response.data.error);
                    } else if (error.request) {
                        toast.dismiss(toastId.current);
                        toast.error(error.request);
                    } else {
                        toast.dismiss(toastId.current);
                        toast.error('Error: ', error.message);
                    }
                    toast.dismiss(toastId.current);
                    toast.error(error.config);
                }
            }
        } else {
            if (currentStep < 3) {
                e.preventDefault();
                nextStep();
            } else {
                e.preventDefault();
                if (gameId === '1') {
                    if (![3, 4, 6, 8, 10, 12, 14].includes(listImageURL.length)) {
                        toast.info(
                            'The number of images is not appropriate.Please add correct 3, 4, 6, 8, 10, 12, 14 images',
                        );
                        return;
                    } else {
                        notifyToast();
                    }
                } else {
                    notifyToast();
                }
                if (!isStepDataValid()) {
                    toast.info('Please all items in this step before going to the next step.');
                    return;
                }
                const gameIdNumber = parseInt(gameId, 10);
                const playTimeNumber = parseInt(playTime, 10);
                let newAssets = [];
                if (gameIdNumber === 1 || gameIdNumber === 4) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: image.url,
                            contestId: 0,
                            typeOfAssetId: 3,
                        });
                    });
                } else if (gameIdNumber === 2) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: image.url,
                            contestId: 0,
                            typeOfAssetId: 5,
                        });
                    });
                } else if (gameIdNumber === 5) {
                    listImageURL.forEach((image) => {
                        newAssets.push({
                            value: `${image.description};${image.url};${image.number}`,
                            contestId: 0,
                            typeOfAssetId: 4,
                        });
                    });
                }

                const formSubmit = {
                    name: name,
                    thumbnail: thumnailURL.url,
                    startTime: startTime,
                    endTime: endTime,
                    coinBetting: coinBetting,
                    gameId: gameIdNumber,
                    playTime: playTimeNumber,
                    assets: newAssets,
                };

                try {
                    const response = await contestService.createContest(formSubmit);

                    if (response) {
                        updateToast();
                        await getListContest().then(handleResetData);
                    }
                } catch (error) {
                    if (error.response) {
                        toast.dismiss(toastId.current);
                        toast.error(error.response.data.error);
                    } else if (error.request) {
                        toast.dismiss(toastId.current);
                        toast.error(error.request);
                    } else {
                        toast.dismiss(toastId.current);
                        toast.error('Error', error.message);
                    }
                    toast.dismiss(toastId.current);
                    toast.error(error.config);
                }
            }
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setGameId(searchParams.get('gameId'));
    }, [location]);

    useEffect(() => {
        if (gameId) {
            getListContest();
        }
    }, [gameId]);

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Contest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {gameId === '5' ? (
                        <div id="container-form" className="container mt-5">
                            <div className="progress px-1" style={{ height: '3px' }}>
                                <div
                                    className="progress-bar step-line"
                                    role="progressbar"
                                    style={updateFourProgressBar()}
                                    aria-valuenow="0"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="step-container d-flex justify-content-between">
                                <div className="step-circle">1</div>
                                <div className="step-circle">2</div>
                                <div className="step-circle">3</div>
                                <div className="step-circle">4</div>
                            </div>

                            <Form onSubmit={handleContestSubmit} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name Contest</Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="text"
                                                        placeholder="Enter contest name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <div className="py-4 w-100">
                                                    <label htmlFor="field3" className="form-label">
                                                        Thumnail of Contest
                                                    </label>
                                                    <Uploader
                                                        listType="picture-text"
                                                        onSuccess={handleUploadThumnailSuccess}
                                                        onRemove={handleRemoveThumnailFile}
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/contests?type=${
                                                            gameId === '1'
                                                                ? '3'
                                                                : gameId === '2'
                                                                ? '2'
                                                                : gameId === '4'
                                                                ? '4'
                                                                : gameId === '5'
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
                                                            <span>Click or Drag files to this area to upload</span>
                                                        </div>
                                                    </Uploader>
                                                </div>
                                            </div>
                                            <div className="w-100 d-flex justify-content-end">
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <div className="mb-3">
                                                <div className="row">
                                                    <div className="col">
                                                        <Form.Group controlId="formStartDate">
                                                            <Form.Label>Start Date</Form.Label>
                                                            <Form.Control
                                                                size="lg"
                                                                type="datetime-local"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col">
                                                        <Form.Group controlId="formEndDate">
                                                            <Form.Label>End Date</Form.Label>
                                                            <Form.Control
                                                                size="lg"
                                                                type="datetime-local"
                                                                value={endTime}
                                                                onChange={(e) => setEndTime(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                </div>

                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Coin Betting</Form.Label>
                                                    <Form.Select
                                                        size="lg"
                                                        value={coinBetting}
                                                        onChange={(e) => setCoinBetting(e.target.value)}
                                                    >
                                                        <option value="">Select coin betting</option>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group controlId="formPlayTime">
                                                    <Form.Label>Play Time (second)</Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="number"
                                                        value={playTime}
                                                        onChange={(e) => setPlayTime(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevFourStep}>
                                                    Previous
                                                </Button>
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 3 && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="field3" className="form-label">
                                                    {gameId === '2' || gameId === '5'
                                                        ? 'Contest Game Asset : Asset file name must be answer of asset'
                                                        : 'Contest Game Asset'}
                                                </label>
                                                <div>
                                                    <Uploader
                                                        accept={acceptValue}
                                                        multiple
                                                        listType="picture"
                                                        onSuccess={handleUploadSuccess}
                                                        onRemove={handleRemoveFile}
                                                        action="https://thinktank-sep490.azurewebsites.net/api/files/contests?type=1"
                                                        // draggable
                                                    >
                                                        <div>{gameId === '2' ? <FaMusic /> : <FaCameraRetro />}</div>
                                                    </Uploader>
                                                </div>
                                            </div>

                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevStep}>
                                                    Previous
                                                </Button>
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 4 && (
                                        <>
                                            <div className="mb-3 w-100">
                                                {listImageURL.map((imageUrl, index) => (
                                                    <div className="card-content w-100 card">
                                                        <div key={index} className="input-image-container w-100">
                                                            <div
                                                                style={{
                                                                    width: 60,
                                                                    height: 60,
                                                                    background: '#f5f5f5',
                                                                    borderRadius: 6,
                                                                    overflow: 'hidden',
                                                                    display: 'inline-block',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        imageUrl.url
                                                                            ? imageUrl.url
                                                                            : 'https://via.placeholder.com/50x50'
                                                                    }
                                                                    alt="Game Resource"
                                                                    className="card-image"
                                                                />
                                                            </div>
                                                            <div className="w-100">
                                                                <h4>{imageUrl.name}</h4>
                                                                <input
                                                                    type="text"
                                                                    className="answer-input"
                                                                    placeholder="Enter resource description"
                                                                    onChange={(e) =>
                                                                        handleDescriptionChange(index, e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevStep}>
                                                    Previous
                                                </Button>
                                                <Button primary type="submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Form>
                        </div>
                    ) : (
                        <div id="container-form" className="container mt-5">
                            <div className="progress px-1" style={{ height: '3px' }}>
                                <div
                                    className="progress-bar step-line"
                                    role="progressbar"
                                    style={updateProgressBar()}
                                    aria-valuenow="0"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="step-container d-flex justify-content-between">
                                <div className="step-circle">1</div>
                                <div className="step-circle">2</div>
                                <div className="step-circle">3</div>
                            </div>

                            <Form onSubmit={handleContestSubmit} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name Contest</Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="text"
                                                        placeholder="Enter contest name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <div className="py-4 w-100">
                                                    <label htmlFor="field3" className="form-label">
                                                        Thumnail of Contest
                                                    </label>
                                                    <Uploader
                                                        listType="picture-text"
                                                        onSuccess={handleUploadThumnailSuccess}
                                                        onRemove={handleRemoveThumnailFile}
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/contests?type=${
                                                            gameId === '1'
                                                                ? '3'
                                                                : gameId === '2'
                                                                ? '2'
                                                                : gameId === '4'
                                                                ? '4'
                                                                : gameId === '5'
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
                                                            <span>Click or Drag files to this area to upload</span>
                                                        </div>
                                                    </Uploader>
                                                </div>
                                            </div>
                                            <div className="w-100 d-flex justify-content-end">
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <div className="mb-3">
                                                <div className="row">
                                                    <div className="col">
                                                        <Form.Group controlId="formStartDate">
                                                            <Form.Label>Start Date</Form.Label>
                                                            <Form.Control
                                                                size="lg"
                                                                type="datetime-local"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col">
                                                        <Form.Group controlId="formEndDate">
                                                            <Form.Label>End Date</Form.Label>
                                                            <Form.Control
                                                                size="lg"
                                                                type="datetime-local"
                                                                value={endTime}
                                                                onChange={(e) => setEndTime(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                </div>

                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Coin Betting</Form.Label>
                                                    <Form.Select
                                                        size="lg"
                                                        value={coinBetting}
                                                        onChange={(e) => setCoinBetting(e.target.value)}
                                                    >
                                                        <option value="">Select coin betting</option>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group controlId="formPlayTime">
                                                    <Form.Label>Play Time (second)</Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="number"
                                                        value={playTime}
                                                        onChange={(e) => setPlayTime(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevStep}>
                                                    Previous
                                                </Button>
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 3 && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="field3" className="form-label">
                                                    {gameId === '2' || gameId === '5'
                                                        ? 'Contest Game Asset : Asset file name must be answer of asset'
                                                        : 'Contest Game Asset'}
                                                </label>
                                                <div>
                                                    <Uploader
                                                        accept={acceptValue}
                                                        multiple
                                                        listType="picture"
                                                        onSuccess={handleUploadSuccess}
                                                        onRemove={handleRemoveFile}
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/contests?type=${
                                                            gameId === '1'
                                                                ? '3'
                                                                : gameId === '2'
                                                                ? '2'
                                                                : gameId === '4'
                                                                ? '4'
                                                                : gameId === '5'
                                                                ? '1'
                                                                : ''
                                                        }`}
                                                        // draggable
                                                    >
                                                        <div>{gameId === '2' ? <FaMusic /> : <FaCameraRetro />}</div>
                                                    </Uploader>
                                                </div>
                                            </div>

                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevStep}>
                                                    Previous
                                                </Button>
                                                <Button primary type="submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button outline onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="d-flex align-items-center flex-column">
                <h1 className="contest-title">
                    Contest of{' '}
                    {gameId === '1'
                        ? 'Flip Card'
                        : gameId === '2'
                        ? 'Music Password'
                        : gameId === '4'
                        ? 'Images Walkthrough'
                        : gameId === '5'
                        ? 'Find Anonymous'
                        : ''}
                </h1>
                <div className="w-100 d-flex justify-content-end">
                    <Button
                        outline
                        text
                        onClick={handleShow}
                        leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
                    >
                        Create Contest
                    </Button>
                </div>
                <div className="w-100 m-5">
                    <div className="card">
                        <Table
                            height={Math.max(getHeight(window) - 200, 400)}
                            data={data}
                            sortColumn={sortColumn}
                            sortType={sortType}
                            onSortColumn={handleSortColumn}
                            loading={loading}
                            rowHeight={90}
                            // virtualized
                        >
                            <Column width={200} fixed align="center">
                                <HeaderCell>Thumnail</HeaderCell>
                                <ImageCell dataKey="thumbnail" />
                            </Column>

                            <Column width={200} fixed fullText sortable>
                                <HeaderCell>Contest Name</HeaderCell>
                                <CompactCell dataKey="name" />
                            </Column>

                            <Column width={140} fixed fullText sortable align="center">
                                <HeaderCell>Amout Player</HeaderCell>
                                <CompactCell dataKey="amoutPlayer" />
                            </Column>

                            <Column width={200} fixed fullText sortable>
                                <HeaderCell>Game Name</HeaderCell>
                                <CompactCell dataKey="gameName" />
                            </Column>

                            <Column width={200} fixed fullText sortable>
                                <HeaderCell>Start Date</HeaderCell>
                                <CompactCell dataKey="startTime" />
                            </Column>

                            <Column width={200} fixed fullText sortable>
                                <HeaderCell>End Date</HeaderCell>
                                <CompactCell dataKey="endTime" />
                            </Column>

                            <Column width={40} flexGrow={1}>
                                <HeaderCell> View Analysis</HeaderCell>
                                <Cell style={{ padding: 6 }}>
                                    {(rowData) => (
                                        <RsuiteButton
                                            color="green"
                                            appearance="primary"
                                            onClick={() => handleViewClick(rowData)}
                                        >
                                            View
                                        </RsuiteButton>
                                    )}
                                </Cell>
                            </Column>
                            <Column width={40} flexGrow={1}>
                                <HeaderCell> Delete</HeaderCell>
                                <Cell style={{ padding: 6 }}>
                                    {(rowData) => (
                                        <RsuiteButton
                                            color="red"
                                            appearance="primary"
                                            onClick={() => handleDeleteContest(rowData.id)}
                                        >
                                            Delete
                                        </RsuiteButton>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                        <div style={{ padding: 20 }}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                size="md"
                                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                                total={listContests?.length}
                                limitOptions={[10, 30, 50]}
                                limit={limit}
                                activePage={page}
                                onChangePage={setPage}
                                onChangeLimit={handleChangeLimit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContestGame;
