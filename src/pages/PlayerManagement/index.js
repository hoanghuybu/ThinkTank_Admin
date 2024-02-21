import React, { useState, useEffect } from 'react';

//util
import * as playerManagementService from '~/service/PlayerManagementService';

import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faFilter } from '@fortawesome/free-solid-svg-icons';
import './PlayerManagement.scss';
import Search from '~/layouts/Search';
import { get } from '~/untils/request';

function PlayerManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [listPlayers, setListPlayer] = useState([]);

    const itemsPerPage = 2;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = listPlayers.slice(startIndex, endIndex);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="w-100 d-flex justify-content-end mt-4 mb-4">
                    <Search></Search>
                    <button className="btn-pagi mx-2">
                        <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                    </button>
                </div>
                <div className="card">
                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center">Code</th>
                                    <th className="text-center">Image</th>
                                    <th>Name</th>
                                    <th>Birthday</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {currentData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{item?.code}</td>
                                        <td className="text-center">
                                            <img
                                                className="column-image"
                                                // src={item.image}
                                                src="https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU"
                                                alt={`Image of ${item.name}`}
                                            />
                                        </td>
                                        <td>{item?.fullName}</td>
                                        <td>{item?.dateOfBirth}</td>
                                        <td>{item?.email}</td>
                                        <td>{item?.gender}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    item?.status === true ? 'bg-label-success' : 'bg-label-danger'
                                                } me-1`}
                                            >
                                                {item?.status === true ? 'Active' : 'InActive'}
                                            </span>
                                            {/* {item?.status === true ? 'Active' : 'InActive'} */}
                                        </td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    Select Actions
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleBlockPlayer(item.id)}>
                                                        Block
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
                        Showing {startIndex + 1} to {endIndex > listPlayers.length ? listPlayers.length : endIndex} of{' '}
                        {listPlayers.length}
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
    );
}

export default PlayerManagement;
