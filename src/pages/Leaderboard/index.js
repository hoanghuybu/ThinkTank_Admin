import React, { useEffect, useState } from 'react';
import { Form, Carousel } from 'react-bootstrap';
import * as dashboardManagement from '../../service/DashboardService';
import * as leaderboardService from '../../service/LeaderboardService';
import * as contestService from '../../service/ContestService';
import './Leaderboard.scss';
import images from '~/assets/images';
import { toast } from 'react-toastify';
import { Loader } from 'rsuite';

function Leaderboard() {
    const [selectedButton, setSelectedButton] = useState('Game');
    const [listGames, setListGames] = useState([]);
    const [listLeaderboardGame, setListLeaderboardGame] = useState([]);
    const [listLeaderboardContest, setListLeaderboardContest] = useState([]);
    const [index, setIndex] = useState(0);
    const [gameId, setGameId] = useState(1);
    const [listContests, setListContest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contestId, setContestId] = useState('');

    //handle Select game
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);

        if (listGames) {
            const selectedGameId = listGames[selectedIndex].id;
            setGameId(selectedGameId);
        }
    };

    //API

    const getListLeaderboardGame = async () => {
        try {
            const result = await leaderboardService.getListLeaderboardGame(gameId);

            setListLeaderboardGame(result.results);
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

    const getListContest = async () => {
        setLoading(true);
        try {
            const id = parseInt(gameId, 10);
            const result = await contestService.getListContestByGameID(null, null, id, 1);
            if (result) {
                setListContest(result.results);
                setContestId('');
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

    const getListLeaderboardContest = async () => {
        try {
            const result = await leaderboardService.getListLeaderboardContest(contestId);
            setListLeaderboardContest(result.results);
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

    useEffect(() => {
        const getListGames = async () => {
            try {
                const result = await dashboardManagement.getListGames();
                setListGames(result.results);
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

        getListGames();
    }, []);

    useEffect(() => {
        getListLeaderboardGame();
        getListContest();
    }, [gameId]);

    useEffect(() => {
        if (contestId) {
            getListLeaderboardContest();
        }
    }, [contestId]);
    return (
        <div className="container-leaderboard">
            <div className="frame">
                <header>Leaderboard</header>
                <div className="button-group">
                    <button
                        className={selectedButton === 'Game' ? 'selected' : ''}
                        onClick={() => setSelectedButton('Game')}
                    >
                        Game
                    </button>
                    <button
                        className={selectedButton === 'Contest' ? 'selected' : ''}
                        onClick={() => setSelectedButton('Contest')}
                    >
                        Contest
                    </button>
                </div>
                <div className="w-100 mt-4">
                    <h1 className="text-center">Select Game</h1>
                    <Carousel variant="dark" activeIndex={index} onSelect={handleSelect} interval={null}>
                        {listGames.map((item, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={
                                        item?.id === 1
                                            ? images.Flipcard
                                            : item?.id === 2
                                            ? images.MusicPassword
                                            : item?.id === 4
                                            ? images.ImageWalkThroungh
                                            : item?.id === 5
                                            ? images.FindAnonymous
                                            : 'https://via.placeholder.com/800x400'
                                    }
                                    alt={item?.name}
                                    height={350}
                                    style={{ objectFit: 'contain' }}
                                />
                                <Carousel.Caption className="d-flex justify-content-center align-items-center">
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(177, 177, 177, 0.6)',
                                            padding: '10px 15px 10px 15px',
                                            width: '500px',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                color: 'black',
                                                fontSize: '32px',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {item?.name}
                                        </h3>
                                        <p style={{ color: 'black', fontSize: '24px' }}>
                                            {item?.amoutPlayer} Player was played
                                        </p>
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                {selectedButton === 'Contest' && (
                    <div className="w-100 row m-3">
                        <h1 className="text-center">Select Contest</h1>

                        {!loading ? (
                            <div>
                                <Form.Group controlId="formCoinBetting">
                                    <Form.Select
                                        size="lg"
                                        value={contestId}
                                        onChange={(e) => setContestId(e.target.value)}
                                    >
                                        <option value="">Select Contest</option>
                                        {listContests.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        ) : (
                            <Loader size="md"></Loader>
                        )}
                    </div>
                )}
                {selectedButton === 'Game' && (
                    <div className="w-100">
                        <div className="top-leaders-list">
                            {listLeaderboardGame.map((leader, index) => (
                                <div className="leader" key={index}>
                                    {index + 1 <= 3 && (
                                        <div className="containerImage">
                                            <img className="image" loading="lazy" src={leader?.avatar} alt="Player" />
                                            <div className="crown">
                                                <svg
                                                    id="crown1"
                                                    fill="#0f74b5"
                                                    data-name="Layer 1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 100 50"
                                                >
                                                    <polygon
                                                        className="cls-1"
                                                        points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="leaderName">{leader.fullName}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="playerslist">
                            {listLeaderboardGame && listLeaderboardGame.length > 0 ? (
                                <div className="table-leaderboard">
                                    <div>Rank</div>
                                    <div>Name</div>
                                    <div>Avatar</div>
                                    <div>Mark</div>
                                </div>
                            ) : (
                                <h2 className="text-center">No Data</h2>
                            )}
                            <div className="list">
                                {listLeaderboardGame.map((leader, index) => (
                                    <div className="player" key={index}>
                                        <span> {leader.rank}</span>
                                        <div className="user">
                                            <span> {leader.fullName} </span>
                                        </div>
                                        <span>
                                            {' '}
                                            <img className="image" src={leader.avatar} alt="Player" />{' '}
                                        </span>
                                        <span> {leader.mark} </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {selectedButton === 'Contest' && (
                    <div className="w-100">
                        <div className="top-leaders-list">
                            {listLeaderboardContest.map((leader, index) => (
                                <div className="leader" key={index}>
                                    {index + 1 <= 3 && (
                                        <div className="containerImage">
                                            <img className="image" loading="lazy" src={leader?.avatar} alt="Player" />
                                            <div className="crown">
                                                <svg
                                                    id="crown1"
                                                    fill="#0f74b5"
                                                    data-name="Layer 1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 100 50"
                                                >
                                                    <polygon
                                                        className="cls-1"
                                                        points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="leaderName">{leader.fullName}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="playerslist">
                            {listLeaderboardContest && listLeaderboardContest.length > 0 ? (
                                <>
                                    <div className="table-leaderboard">
                                        <div>Rank</div>
                                        <div>Name</div>
                                        <div>Avatar</div>
                                        <div>Mark</div>
                                    </div>
                                    <div className="list">
                                        {listLeaderboardContest.map((leader, index) => (
                                            <div className="player" key={index}>
                                                <span> {leader.rank}</span>
                                                <div className="user">
                                                    <span> {leader.fullName} </span>
                                                </div>
                                                <span>
                                                    {' '}
                                                    <img className="image" src={leader.avatar} alt="Player" />{' '}
                                                </span>
                                                <span> {leader.mark} </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <h2 className="text-center">No Data</h2>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
