import React, { useState } from 'react';
import './Leaderboard.scss';

function Leaderboard() {
    const [selectedButton, setSelectedButton] = useState('Game');

    return (
        <div className="container">
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
            </div>
        </div>
    );
}

export default Leaderboard;
