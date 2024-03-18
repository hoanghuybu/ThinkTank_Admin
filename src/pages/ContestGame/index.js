import './ContestGame.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Uploader } from 'rsuite';
import { FaCameraRetro, FaMusic } from 'react-icons/fa';
import * as contestService from '~/service/ContestService';
import { toast } from 'react-toastify';

function ContestGame() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentStep, setCurrentStep] = useState(1);
    const [listContests, setListContest] = useState([]);
    const [listImageURL, setListImageURL] = useState([]);
    const [gameId, setGameId] = useState();
    const [thumnailURL, setThumnailURL] = useState();
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [coinBetting, setCoinBetting] = useState('');
    const location = useLocation();
    const [show, setShow] = useState(false);
    const toastId = React.useRef(null);
    const navigate = useNavigate();

    //Toast
    const notifyToast = () => (toastId.current = toast('In process, please wait ...', { autoClose: false }));

    const updateToast = () =>
        toast.update(toastId.current, {
            render: 'Update succes',
            type: 'success',
            autoClose: 5000,
        });

    //handle pagination
    const itemsPerPage = 2;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = listContests.slice(startIndex, endIndex);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //handle modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //handle multi step form
    const displayStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= 3) {
            setCurrentStep(stepNumber);
            updateProgressBar();
        }
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            updateProgressBar();
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

    const displayFourStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= 4) {
            setCurrentStep(stepNumber);
            updateFourProgressBar();
        }
    };

    const nextFourStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
            updateFourProgressBar();
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

    const handleRemoveThumnailFile = (file) => {
        setThumnailURL((prevListImageURL) => prevListImageURL.filter((item) => item.name !== file.name));
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

    //API

    const getListContest = async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const id = parseInt(gameId, 10);
            const result = await contestService.getListContestByGameID(null, null, id, 1, token);
            setListContest(result.results);
        } catch (error) {
            console.log(error);
        }
    };

    const handleContestSubmit = async (e) => {
        e.preventDefault();

        notifyToast();

        const token = sessionStorage.getItem('accessToken');
        const gameIdNumber = parseInt(gameId, 10);
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
            assets: newAssets,
        };

        console.log(formSubmit);

        try {
            const response = await contestService.createContest(formSubmit, token);

            if (response) {
                updateToast();
            }
        } catch (error) {
            if (error.response) {
                toast.dismiss(toastId.current);
                toast.error(error.response.data.error);
            } else if (error.request) {
                toast.dismiss(toastId.current);
                console.log(error.request);
            } else {
                toast.dismiss(toastId.current);
                console.log('Error', error.message);
            }
            console.log(error.config);
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
                                <div className="step-circle" onClick={() => displayFourStep(1)}>
                                    1
                                </div>
                                <div className="step-circle" onClick={() => displayFourStep(2)}>
                                    2
                                </div>
                                <div className="step-circle" onClick={() => displayFourStep(3)}>
                                    3
                                </div>
                                <div className="step-circle" onClick={() => displayFourStep(4)}>
                                    4
                                </div>
                            </div>

                            <Form onSubmit={handleContestSubmit} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name Contest</Form.Label>
                                                    <Form.Control
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
                                                <Button primary onClick={nextFourStep}>
                                                    Next
                                                </Button>
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
                                                        value={coinBetting}
                                                        onChange={(e) => setCoinBetting(e.target.value)}
                                                    >
                                                        <option value="">Select coin betting</option>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevFourStep}>
                                                    Previous
                                                </Button>
                                                <Button primary onClick={nextFourStep}>
                                                    Next
                                                </Button>
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
                                                <Button primary onClick={nextFourStep}>
                                                    Next
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 4 && (
                                        <>
                                            <div className="mb-3 w-100">
                                                {listImageURL.map((imageUrl, index) => (
                                                    <div className="card-content w-100 card">
                                                        <div key={index} className="input-image-container w-100">
                                                            <image
                                                                src={
                                                                    imageUrl.url
                                                                        ? imageUrl.url
                                                                        : 'https://via.placeholder.com/50x50'
                                                                }
                                                                alt="Image"
                                                                className="card-image"
                                                            />
                                                            <div className="w-100 mx-4">
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
                                <div className="step-circle" onClick={() => displayStep(1)}>
                                    1
                                </div>
                                <div className="step-circle" onClick={() => displayStep(2)}>
                                    2
                                </div>
                                <div className="step-circle" onClick={() => displayStep(3)}>
                                    3
                                </div>
                            </div>

                            <Form onSubmit={handleContestSubmit} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name Contest</Form.Label>
                                                    <Form.Control
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
                                                <Button primary onClick={nextStep}>
                                                    Next
                                                </Button>
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
                                                        value={coinBetting}
                                                        onChange={(e) => setCoinBetting(e.target.value)}
                                                    >
                                                        <option value="">Select coin betting</option>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                            <div className="w-100 d-flex justify-content-between">
                                                <Button primary onClick={prevStep}>
                                                    Previous
                                                </Button>
                                                <Button primary onClick={nextStep}>
                                                    Next
                                                </Button>
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
                <h1 className="contest-title">Contest of Flip card</h1>
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
                        <div className="table-responsive text-nowrap">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">STT</th>
                                        <th>Name Contest</th>
                                        <th>Name Game</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {currentData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item?.name}</td>
                                            <td>{item?.gameName}</td>
                                            <td>{item?.startTime}</td>
                                            <td>{item?.endTime}</td>

                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Select Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleViewClick(item)}>
                                                            View
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-between">
                        <h4 className="table-text mt-1">
                            Showing {startIndex + 1} to{' '}
                            {endIndex > listContests.length ? listContests.length : endIndex} of {listContests.length}
                        </h4>
                        <div className="pagination">
                            <button
                                className="btn-pagi"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
                            </button>
                            <span className="mx-2">
                                <ul className="pagination d-flex align-items-center h-100">
                                    {Array(Math.ceil(listContests.length / itemsPerPage))
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
                            </span>
                            <button
                                className="btn-pagi"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={endIndex >= listContests.length}
                            >
                                <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContestGame;
