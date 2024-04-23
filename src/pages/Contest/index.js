import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Contest.scss';

import * as dashboardManagement from '~/service/DashboardService';
import { Loader } from 'rsuite';
import images from '~/assets/images';
import { toast } from 'react-toastify';

function Contest() {
    const [listGames, setListGames] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getListGames = async () => {
            setLoading(true);
            try {
                const result = await dashboardManagement.getListGames();
                if (result) {
                    setListGames(result.results);
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

        getListGames();
    }, []);
    return (
        <div>
            {loading ? (
                <Loader content="Loading" center size="lg"></Loader>
            ) : (
                <section>
                    <div className="container py-5">
                        <div className="row justify-content-start mb-3">
                            <div className="col-md-12 col-xl-10">
                                {listGames.map((game, index) => (
                                    <Link
                                        key={index}
                                        to={`/Contest/ContestGame?gameId=${game.id}`}
                                        className="link-wrapper"
                                    >
                                        <div className="card my-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 col-lg-4 col-xl-4 mb-4 mb-lg-0">
                                                        <div className="bg-image hover-zoom ripple rounded ripple-surface">
                                                            <img
                                                                alt="Game background"
                                                                src={
                                                                    game.id === 1
                                                                        ? images.Flipcard
                                                                        : game.id === 2
                                                                        ? images.MusicPassword
                                                                        : game.id === 4
                                                                        ? images.ImageWalkThroungh
                                                                        : game.id === 5
                                                                        ? images.FindAnonymous
                                                                        : 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp'
                                                                }
                                                                className="w-100"
                                                                height={150}
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-lg-8 col-xl-8">
                                                        <div className="game-title">Contest Game {game.name}</div>
                                                        <div className="game-description">
                                                            Within the think tank app, a game sharpens short-term
                                                            memory. Challenges hone recall and mental agility. With each
                                                            level, resilience strengthens. Amid life's chaos, it's a
                                                            beacon of focus.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Contest;
