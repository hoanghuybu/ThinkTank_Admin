import './ResourceDetail.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import * as resourceGameService from '~/service/ResourceGameService';
import { Dropdown, Modal, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Uploader } from 'rsuite';
import { FaCameraRetro, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ResourceDetail() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentStep, setCurrentStep] = useState(1);
    const [listResources, setListResource] = useState([]);
    const [listTopic, setListTopic] = useState([]);
    const [listImageURL, setListImageURL] = useState([]);
    const [topic, setTopic] = useState();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [gameId, setGameId] = useState();
    const [otherTopic, setOtherTopic] = useState('');
    const [showOtherForm, setShowOtherForm] = useState(false);

    const toastId = React.useRef(null);

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
    const currentData = listResources.slice(startIndex, endIndex);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //handle modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOhterTopicClose = () => setShowOtherForm(false);

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

    const displayTwoStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= 2) {
            setCurrentStep(stepNumber);
            updateTwoProgressBar();
        }
    };

    const nextTwoStep = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
            updateTwoProgressBar();
        }
    };

    const prevTwoStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            updateTwoProgressBar();
        }
    };

    const updateTwoProgressBar = () => {
        const progressPercentage = (currentStep - 1) * 100;
        return { width: progressPercentage + '%' };
    };

    //handle select topic
    const handleTopicChange = (e) => {
        const selectedTopic = e.target.value;
        if (selectedTopic === 'Other') {
            setShowOtherForm(true);
            setShow(false);
        } else {
            setShowOtherForm(false);
            setTopic(selectedTopic);
        }
    };

    //handle upload game resource
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

    //handle value for game find anonymous
    const handleDescriptionChange = (index, description) => {
        const updatedImageList = [...listImageURL];
        updatedImageList[index] = { ...updatedImageList[index], description };
        setListImageURL(updatedImageList);
    };

    //API
    const getListResources = async () => {
        try {
            const id = parseInt(gameId, 10);
            const result = await resourceGameService.getListResourceByGameID(null, null, id);
            setListResource(result.results);
        } catch (error) {
            console.log(error);
        }
    };

    const getListTopic = async () => {
        try {
            const result = await resourceGameService.getListTopicsOfGame(gameId);
            if (result) {
                setListTopic(result.results);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteResource = async (resourceId) => {
        const id = parseInt(resourceId, 10);
        const formSubmit = [id];
        console.log(formSubmit);
        try {
            const result = await resourceGameService.deleteResource(formSubmit);
            if (result) {
                getListResources();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOtherTopicSubmit = async (e) => {
        e.preventDefault();
        const gameIdNumber = parseInt(gameId, 10);
        const formSubmit = {
            name: otherTopic,
            gameId: gameIdNumber,
        };

        try {
            const response = await resourceGameService.createNewTopic(formSubmit);
            if (response) {
                getListTopic();
                handleOhterTopicClose();
                handleShow();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitResource = async (e) => {
        e.preventDefault();
        notifyToast();
        let formSubmit = [];
        const topicId = parseInt(topic, 10);

        if (gameId === '5') {
            listImageURL.forEach((image) => {
                formSubmit.push({
                    value: `${image.description};${image.url}`,
                    topicId: topicId,
                    typeOfAssetId: 19,
                });
            });
        } else if (gameId === '1' || gameId === '4') {
            listImageURL.forEach((image) => {
                formSubmit.push({
                    value: image.url,
                    topicId: topicId,
                    typeOfAssetId: 20,
                });
            });
        } else if (gameId === '2') {
            listImageURL.forEach((image) => {
                formSubmit.push({
                    value: image.url,
                    topicId: topicId,
                    typeOfAssetId: 24,
                });
            });
        }

        console.log(formSubmit);

        try {
            const response = await resourceGameService.createResource(formSubmit);

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

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setGameId(searchParams.get('gameId'));
    }, [location]);

    useEffect(() => {
        if (gameId) {
            getListResources();
            getListTopic();
        }
    }, [gameId]);

    return (
        <>
            <Modal show={showOtherForm} onHide={handleOhterTopicClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Topic Game</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <Form onSubmit={handleOtherTopicSubmit}>
                            <Form.Group controlId="formOtherTopic">
                                <Form.Label>Name Topic</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new topic"
                                    value={otherTopic}
                                    onChange={(e) => setOtherTopic(e.target.value)}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-center my-4">
                                <Button primary type="submit">
                                    {' '}
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Game Resource</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {gameId === '1' || gameId === '4' || gameId === '2' ? (
                        <div id="container-form" className="container mt-5">
                            <div className="progress px-1" style={{ height: '3px' }}>
                                <div
                                    className="progress-bar step-line"
                                    role="progressbar"
                                    style={updateTwoProgressBar()}
                                    aria-valuenow="0"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="step-container d-flex justify-content-between">
                                <div className="step-circle" onClick={() => displayTwoStep(1)}>
                                    1
                                </div>
                                <div className="step-circle" onClick={() => displayTwoStep(2)}>
                                    2
                                </div>
                            </div>

                            <Form onSubmit={handleSubmitResource} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Game Topic</Form.Label>
                                                    <Form.Select value={topic} onChange={handleTopicChange}>
                                                        <option value="">Select game topic</option>
                                                        {listTopic?.map((topic, index) => (
                                                            <option key={index} value={topic?.id}>
                                                                {topic?.name}
                                                            </option>
                                                        ))}
                                                        <option value="Other">Other topic</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                            <div className="w-100 d-flex justify-content-end">
                                                <Button primary onClick={nextTwoStep}>
                                                    Next
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="field3" className="form-label">
                                                    {gameId === '5'
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
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/resources?type=${
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
                                                <Button primary onClick={prevTwoStep}>
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

                            <Form onSubmit={handleSubmitResource} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Game Topic</Form.Label>
                                                    <Form.Select value={topic} onChange={handleTopicChange}>
                                                        <option value="">Select game topic</option>
                                                        {listTopic?.map((topic, index) => (
                                                            <option key={index} value={topic?.id}>
                                                                {topic?.name}
                                                            </option>
                                                        ))}
                                                        <option value="Other">Other topic</option>
                                                    </Form.Select>
                                                </Form.Group>
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
                                                        action={`https://thinktank-sep490.azurewebsites.net/api/files/resources?type=${
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
                                                <Button primary onClick={nextStep}>
                                                    Next
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 3 && (
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
                    Resource of{' '}
                    {gameId === '1'
                        ? 'Flip Card'
                        : gameId === '2'
                        ? 'Music Password'
                        : gameId === '4'
                        ? 'Image Walkthroung'
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
                        Create Resource
                    </Button>
                </div>
                <div className="w-100 m-5">
                    <div className="card">
                        <div className="table-responsive text-nowrap">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">STT</th>
                                        <th className="text-center">Image</th>
                                        <th>Topic Name</th>
                                        <th>Game Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {currentData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">
                                                <img
                                                    className="column-image"
                                                    src={
                                                        item.value
                                                            ? item.value.replace(/^(.*?);/, '')
                                                            : 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU'
                                                    }
                                                    alt={`${item?.name}`}
                                                />
                                            </td>
                                            <td>{item?.topicName}</td>
                                            <td>{item?.gameName}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        item?.status === true ? 'bg-label-success' : 'bg-label-danger'
                                                    } me-1`}
                                                >
                                                    {item?.status === true ? 'Active' : 'InActive'}
                                                </span>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Select Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleDeleteResource(item.id)}>
                                                            Delete
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
                            {endIndex > listResources.length ? listResources.length : endIndex} of{' '}
                            {listResources.length}
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
                                    {Array(Math.ceil(listResources.length / itemsPerPage))
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
                                disabled={endIndex >= listResources.length}
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

export default ResourceDetail;
