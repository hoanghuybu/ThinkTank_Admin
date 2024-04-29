import './ResourceDetail.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import * as resourceGameService from '~/service/ResourceGameService';
import { Modal, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Uploader, DOMHelper, Table, Pagination, Loader, SelectPicker, Stack } from 'rsuite';
import { Button as RsuiteButton } from 'rsuite';
import { FaCameraRetro, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactAudioPlayer from 'react-audio-player';
import images from '~/assets/images';

const { Column, HeaderCell, Cell } = Table;

const CompactCell = (props) => <Cell {...props} style={{ padding: 6 }} />;

const ImageCell = ({ gameId, rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 3 }}>
        <div
            style={{
                width: gameId === '2' ? 350 : 80,
                height: gameId === '2' ? 90 : 80,
                background: '#f5f5f5',
                borderRadius: 6,
                overflow: 'hidden',
                display: 'inline-block',
            }}
        >
            {gameId === '2' ? (
                <>
                    <img alt="user avatar" src={images.headphoneImg} width="40" />
                    <div>
                        <ReactAudioPlayer src={rowData.value} controls />
                    </div>
                </>
            ) : (
                <img
                    alt="user avatar"
                    src={rowData.value ? rowData.value.replace(/^(.*?);/, '') : 'https://via.placeholder.com/40x40'}
                    width="80"
                />
            )}
        </div>
    </Cell>
);

const { getHeight } = DOMHelper;

function ResourceDetail() {
    const [currentStep, setCurrentStep] = useState(1);
    const [listResources, setListResource] = useState([]);
    const [listTopic, setListTopic] = useState([]);
    const [listImageURL, setListImageURL] = useState([]);
    const [topic, setTopic] = useState();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [gameId, setGameId] = useState();
    const [otherTopic, setOtherTopic] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filter, setFilter] = useState(0);
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

    //handle modal
    const handleClose = () => {
        handleResetData();
        setShow(false);
    };
    const handleShow = () => setShow(true);
    const handleOhterTopicClose = () => {
        handleResetData();
        setShowOtherForm(false);
    };

    //handle multi step form

    const handleResetData = () => {
        setTopic();
        setListImageURL([]);
        setCurrentStep(1);
    };

    const isStepDataValid = () => {
        switch (currentStep) {
            case 1:
                return topic !== null && topic !== undefined && topic !== '';
            case 2:
                return listImageURL.length > 0;
            case 3:
                return listImageURL.every((obj) => obj.hasOwnProperty('description'));

            default:
                return false;
        }
    };

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

    const nextTwoStep = () => {
        if (isStepDataValid()) {
            setCurrentStep(currentStep + 1);
            updateProgressBar();
        } else {
            toast.info('Please all items in this step before going to the next step.');
            return;
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

    //handle table resource
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
        let sortedData = listResources;
        if (sortedData) {
            sortedData = sortedData.filter((item) => {
                return filter === 0 || filter === null || item.topicId === filter;
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

    let dataFilter = [];
    //Filter by topic
    if (listTopic.length > 0) {
        dataFilter = listTopic.map((item) => ({ label: item?.name, value: item?.id }));
    }

    //API
    const getListResources = async () => {
        setLoading(true);
        try {
            const id = parseInt(gameId, 10);
            const result = await resourceGameService.getListResourceByGameID(null, 1000, id);
            if (result) {
                setListResource(result.results);
                setLoading(false);
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
        }
    };

    const getListTopic = async () => {
        setFilterLoading(true);
        try {
            const result = await resourceGameService.getListTopicsOfGame(gameId);
            if (result) {
                setListTopic(result.results);
                setFilterLoading(false);
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
        }
    };

    const handleDeleteResource = async (resourceId) => {
        const id = parseInt(resourceId, 10);
        const formSubmit = [id];
        try {
            const result = await resourceGameService.deleteResource(formSubmit);
            if (result) {
                await getListResources();
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
        }
    };

    const handleOtherTopicSubmit = async (e) => {
        e.preventDefault();

        if (!otherTopic) {
            toast.info('Please all items in this step before going to the next step.');
            return;
        }
        const gameIdNumber = parseInt(gameId, 10);
        const formSubmit = {
            name: otherTopic,
            gameId: gameIdNumber,
        };

        try {
            const response = await resourceGameService.createNewTopic(formSubmit);
            if (response) {
                await getListTopic().then(setOtherTopic(''));
                handleOhterTopicClose();
                handleShow();
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
        }
    };

    const handleSubmitResource = async (e) => {
        e.preventDefault();
        if (gameId === '5') {
            if (currentStep < 3) {
                e.preventDefault();
                nextStep();
            } else {
                e.preventDefault();
                if (!isStepDataValid()) {
                    toast.info('Please all items in this step before going to the next step.');
                    return;
                }
                notifyToast();
                let formSubmit = [];
                const topicId = parseInt(topic, 10);

                listImageURL.forEach((image) => {
                    formSubmit.push({
                        value: `${image.description};${image.url}`,
                        topicId: topicId,
                        typeOfAssetId: 19,
                    });
                });

                try {
                    const response = await resourceGameService.createResource(formSubmit);

                    if (response) {
                        await getListResources().then(handleResetData);
                        updateToast();
                    }
                } catch (error) {
                    if (error.response) {
                        toast.dismiss(toastId.current);
                        if (error.response.data.error) {
                            toast.error(error.response.data.error);
                        }
                        if (error.response.data.errors) {
                            for (let key in error.response.data.errors) {
                                if (error.response.data.errors.hasOwnProperty(key)) {
                                    error.response.data.errors[key].forEach((errorMessage) => {
                                        const errorString = `${key}: ${errorMessage}`;
                                        toast.error(errorString);
                                    });
                                }
                            }
                        }
                    } else if (error.request) {
                        toast.dismiss(toastId.current);
                        toast.error('Error: ' + error.request);
                    } else {
                        toast.dismiss(toastId.current);
                        toast.error('Error: ' + error.message);
                    }
                    toast.dismiss(toastId.current);
                    toast.error('Error: ' + error.config);
                }
            }
        } else {
            if (currentStep < 2) {
                e.preventDefault();
                nextTwoStep();
            } else {
                e.preventDefault();
                if (!isStepDataValid()) {
                    toast.info('Please all items in this step before going to the next step.');
                    return;
                }
                notifyToast();
                let formSubmit = [];
                const topicId = parseInt(topic, 10);

                if (gameId === '1' || gameId === '4') {
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

                try {
                    const response = await resourceGameService.createResource(formSubmit);

                    if (response) {
                        await getListResources().then(handleResetData);
                        updateToast();
                    }
                } catch (error) {
                    if (error.response) {
                        toast.dismiss(toastId.current);
                        if (error.response.data.error) {
                            toast.error(error.response.data.error);
                        }
                        if (error.response.data.errors) {
                            for (let key in error.response.data.errors) {
                                if (error.response.data.errors.hasOwnProperty(key)) {
                                    error.response.data.errors[key].forEach((errorMessage) => {
                                        const errorString = `${key}: ${errorMessage}`;
                                        toast.error(errorString);
                                    });
                                }
                            }
                        }
                    } else if (error.request) {
                        toast.dismiss(toastId.current);
                        toast.error('Error: ' + error.request);
                    } else {
                        toast.dismiss(toastId.current);
                        toast.error('Error: ' + error.message);
                    }
                    toast.dismiss(toastId.current);
                    toast.error('Error: ' + error.config);
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
                                    size="lg"
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
                                <div className="step-circle">1</div>
                                <div className="step-circle">2</div>
                            </div>

                            <Form onSubmit={handleSubmitResource} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Game Topic</Form.Label>
                                                    <Form.Select size="lg" value={topic} onChange={handleTopicChange}>
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
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="field3" className="form-label">
                                                    {gameId === '2'
                                                        ? 'Game Asset : Asset file name must be answer of asset'
                                                        : 'Game Asset'}
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
                                <div className="step-circle">1</div>
                                <div className="step-circle">2</div>
                                <div className="step-circle">3</div>
                            </div>

                            <Form onSubmit={handleSubmitResource} id="multi-step-form">
                                <div className={`step step-${currentStep}`}>
                                    {currentStep === 1 && (
                                        <>
                                            <div className="mb-3">
                                                <Form.Group controlId="formCoinBetting">
                                                    <Form.Label>Game Topic</Form.Label>
                                                    <Form.Select size="lg" value={topic} onChange={handleTopicChange}>
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
                                                <Button primary>Next</Button>
                                            </div>
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="field3" className="form-label">
                                                    {gameId === '2' || gameId === '5'
                                                        ? 'Resource Game Asset : Asset file name must be answer of asset'
                                                        : 'Resource Game Asset'}
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
                <h1 className="resource-title">
                    Resource of{' '}
                    {gameId === '1'
                        ? 'Flip Card'
                        : gameId === '2'
                        ? 'Music Password'
                        : gameId === '4'
                        ? 'Image Walkthrough'
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
                <div className="w-100 d-flex justify-content-end mt-4 mb-4">
                    <Stack spacing={6}>
                        {!filterLoading ? (
                            <SelectPicker
                                label="Filter by Topic"
                                data={dataFilter}
                                searchable={false}
                                value={filter}
                                onChange={(e) => {
                                    setPage(1);
                                    setFilter(e);
                                }}
                                style={{ width: 224 }}
                                virtualized
                            />
                        ) : (
                            <Loader size="md" content="Loading ..." />
                        )}
                    </Stack>
                </div>
                <div className="w-100 m-5">
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
                        <Column width={50} fixed fullText sortable align="center">
                            <HeaderCell>Id</HeaderCell>
                            <CompactCell dataKey="id" />
                        </Column>
                        <Column width={450} fixed flexGrow={1} align="center">
                            <HeaderCell>Resource</HeaderCell>
                            <ImageCell gameId={gameId} dataKey="value" />
                        </Column>

                        <Column width={125} flexGrow={1} fullText sortable>
                            <HeaderCell>Topic Name</HeaderCell>
                            <CompactCell dataKey="topicName" />
                        </Column>

                        <Column width={50} flexGrow={1} fullText sortable>
                            <HeaderCell>Version</HeaderCell>
                            <CompactCell dataKey="version" />
                        </Column>

                        <Column width={200} flexGrow={1} fullText>
                            <HeaderCell>Game Name</HeaderCell>
                            <CompactCell dataKey="gameName" />
                        </Column>

                        <Column width={100} fixed fullText sortable>
                            <HeaderCell>Status</HeaderCell>
                            <Cell>
                                {(rowData) => (
                                    <span
                                        className={`badge ${
                                            rowData?.status === true ? 'bg-label-success' : 'bg-label-danger'
                                        } me-1`}
                                    >
                                        {rowData?.status === true ? 'Active' : 'InActive'}
                                    </span>
                                )}
                            </Cell>
                        </Column>

                        <Column width={100} fixed fullText>
                            <HeaderCell> Delete</HeaderCell>
                            <Cell style={{ padding: 6 }}>
                                {(rowData) => (
                                    <RsuiteButton
                                        color="red"
                                        appearance="primary"
                                        onClick={() => handleDeleteResource(rowData.id)}
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
                            total={getFilteredData()?.length}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResourceDetail;
