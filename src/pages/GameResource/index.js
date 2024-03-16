import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './GameResource.scss';
import images from '~/assets/images';

import * as dashboardManagement from '~/service/DashboardService';

function GameResource() {
    const [listGames, setListGames] = useState([]);

    const getListGames = async () => {
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            const result = await dashboardManagement.getListGames(accessToken);
            setListGames(result.results);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getListGames();
    }, []);
    return (
        <div>
            <section>
                <div className="container py-5">
                    <div className="row justify-content-start mb-3">
                        <div className="col-md-12 col-xl-10">
                            {listGames.map((game, index) => (
                                <Link
                                    key={index}
                                    to={`/GameResource/ResourceDetail?gameId=${game.id}`}
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
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-lg-8 col-xl-8">
                                                    <div className="game-title">{game.name}</div>
                                                    <div className="game-info">
                                                        {game.amoutPlayer} Player was played.
                                                    </div>
                                                    <div className="game-description">
                                                        Within the think tank app, a game sharpens short-term memory.
                                                        Challenges hone recall and mental agility. With each level,
                                                        resilience strengthens. Amid life's chaos, it's a beacon of
                                                        focus.
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
        </div>
    );
}

export default GameResource;
