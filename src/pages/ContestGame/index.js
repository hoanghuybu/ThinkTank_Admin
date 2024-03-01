import './ContestGame.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import * as playerManagementService from '~/service/PlayerManagementService';
import { Dropdown, Modal, Form } from 'react-bootstrap';

function ContestGame() {
    const [currentPage, setCurrentPage] = useState(1);
    const [listPlayers, setListPlayer] = useState([]);
    const [show, setShow] = useState(false);

    //handle pagination
    const itemsPerPage = 2;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = listPlayers.slice(startIndex, endIndex);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //handle modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getListPlayers = async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const result = await playerManagementService.getListPlayers(null, null, token);
            setListPlayer(result.results);
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockPlayer = async (accountId) => {
        const token = sessionStorage.getItem('accessToken');
        const result = await playerManagementService.banPlayers(accountId, token);
        if (result) {
            getListPlayers();
        }
    };

    useEffect(() => {
        getListPlayers();
    }, []);
    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Contest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name Contest</Form.Label>
                            <Form.Control type="text" placeholder="Enter contest name" />
                        </Form.Group>

                        <div className="row">
                            <div className="col">
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group controlId="formImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>

                        {/* Custom Level */}
                        <Form.Group controlId="formCustomLevel">
                            <Form.Label>Custom Level</Form.Label>
                            <Form.Control className="mb-3" type="number" placeholder="Number Image" />
                            <Form.Control className="mb-3" type="number" placeholder="Round" />
                            <Form.Control className="mb-3" type="number" placeholder="Number Oppinerti" />
                            <Form.Control className="mb-3" type="file" placeholder="Resource" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button outline onClick={handleClose}>
                        Close
                    </Button>
                    <Button primary onClick={handleClose}>
                        Save Changes
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
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {currentData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{item?.code}</td>
                                            <td>{item?.fullName}</td>
                                            <td>{item?.dateOfBirth}</td>
                                            <td>{item?.email}</td>

                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Select Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleBlockPlayer(item.id)}>
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
                            Showing {startIndex + 1} to {endIndex > listPlayers.length ? listPlayers.length : endIndex}{' '}
                            of {listPlayers.length}
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
                                    {Array(Math.ceil(listPlayers.length / itemsPerPage))
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
                                disabled={endIndex >= listPlayers.length}
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
