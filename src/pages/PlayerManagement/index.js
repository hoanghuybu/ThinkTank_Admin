import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faFilter } from '@fortawesome/free-solid-svg-icons';
import './UserManagement.scss';
import Search from '~/layouts/Search';

const data = [
    {
        stt: 1,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'John Doe',
        birthday: '01/01/1990',
        email: 'john@example.com',
        gender: 'Male',
    },
    {
        stt: 2,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Jane Smith',
        birthday: '05/15/1985',
        email: 'jane@example.com',
        gender: 'Female',
    },
    {
        stt: 3,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Bob Johnson',
        birthday: '10/20/1995',
        email: 'bob@example.com',
        gender: 'Male',
    },
    {
        stt: 4,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Alice Brown',
        birthday: '03/08/1988',
        email: 'alice@example.com',
        gender: 'Female',
    },
    {
        stt: 5,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Charlie Davis',
        birthday: '07/12/1992',
        email: 'charlie@example.com',
        gender: 'Male',
    },
    {
        stt: 6,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Eva White',
        birthday: '12/25/1980',
        email: 'eva@example.com',
        gender: 'Female',
    },
    {
        stt: 7,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'David Wilson',
        birthday: '09/18/1998',
        email: 'david@example.com',
        gender: 'Male',
    },
    {
        stt: 8,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Grace Miller',
        birthday: '06/30/1994',
        email: 'grace@example.com',
        gender: 'Female',
    },
    {
        stt: 9,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Frank Taylor',
        birthday: '11/05/1987',
        email: 'frank@example.com',
        gender: 'Male',
    },
    {
        stt: 10,
        image: 'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
        name: 'Holly Anderson',
        birthday: '04/22/1991',
        email: 'holly@example.com',
        gender: 'Female',
    },
];

function PlayerManagement() {
    const itemsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="w-100 d-flex justify-content-end mb-4">
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
                                    <th className="text-center">STT</th>
                                    <th className="text-center">Image</th>
                                    <th>Name</th>
                                    <th>Birthday</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {currentData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{startIndex + index + 1}</td>
                                        <td className="text-center">
                                            <img
                                                className="column-image"
                                                src={item.image}
                                                alt={`Image of ${item.name}`}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.birthday}</td>
                                        <td>{item.email}</td>
                                        <td>{item.gender}</td>

                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    Select Actions
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item>Block</Dropdown.Item>
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
                    <h4 className="table-text">
                        Showing {startIndex + 1} to {endIndex > data.length ? data.length : endIndex} of {data.length}
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
                                {Array(Math.ceil(data.length / itemsPerPage))
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
                            disabled={endIndex >= data.length}
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
