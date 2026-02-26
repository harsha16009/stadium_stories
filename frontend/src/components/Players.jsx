import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Players.css';

const FEATURED_INDIAN_PLAYERS = [
    { id: "3710787a-9a99-49dd-9e0c-843fdf5359b3", name: "Virat Kohli", country: "India", role: "Batter", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316605.png" },
    { id: "7343468c-db53-432d-9308-592b0c399ce8", name: "Rohit Sharma", country: "India", role: "Batter", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316500/316526.png" },
    { id: "e102660d-773a-4464-8898-3f8d752f901a", name: "Jasprit Bumrah", country: "India", role: "Bowler", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316500/316584.png" },
    { id: "0d3a9d9e-9d9e-4e4e-9d9e-9d9e9d9e9d9e", name: "Hardik Pandya", country: "India", role: "All-rounder", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316500/316529.png" },
    { id: "1d3a9d9e-9d9e-4e4e-9d9e-9d9e9d9e9d9e", name: "Ravindra Jadeja", country: "India", role: "All-rounder", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316500/316521.png" },
    { id: "2d3a9d9e-9d9e-4e4e-9d9e-9d9e9d9e9d9e", name: "KL Rahul", country: "India", role: "Batter", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316500/316531.png" },
    { id: "3d3a9d9e-9d9e-4e4e-9d9e-9d9e9d9e9d9e", name: "Shubman Gill", country: "India", role: "Batter", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316654.png" },
    { id: "4d3a9d9e-9d9e-4e4e-9d9e-9d9e9d9e9d9e", name: "MS Dhoni", country: "India", role: "WK-Batter", photo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319932.png" }
];

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playerDetails, setPlayerDetails] = useState(null);
    const [fetchingDetails, setFetchingDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('PLAYERS'); // 'PLAYERS' or 'SQUADS'

    const fetchPlayers = async (search = '') => {
        if (search) setSearching(true);
        else setLoading(true);

        try {
            const url = search
                ? `http://localhost:5000/api/players?search=${search}`
                : 'http://localhost:5000/api/players';
            const response = await axios.get(url);

            // If no search, mix featured with others
            if (!search) {
                const apiPlayers = response.data || [];
                // Filter out featured from API to avoid duplicates
                const otherPlayers = apiPlayers.filter(p => !FEATURED_INDIAN_PLAYERS.find(f => f.name.toLowerCase() === p.name.toLowerCase()));
                setPlayers([...FEATURED_INDIAN_PLAYERS, ...otherPlayers]);
            } else {
                setPlayers(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
            if (!search) setPlayers(FEATURED_INDIAN_PLAYERS); // Fallback to featured
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const fetchPlayerDetail = async (id) => {
        setFetchingDetails(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/player-info?id=${id}`);
            setPlayerDetails(response.data);
        } catch (error) {
            console.error('Error fetching player details:', error);
        } finally {
            setFetchingDetails(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'PLAYERS') {
            fetchPlayers();
        }
    }, [activeTab]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlayers(searchTerm);
    };

    const openPlayer = (player) => {
        setSelectedPlayer(player);
        setPlayerDetails(null);
        if (player.id && !player.id.includes('placeholder')) {
            fetchPlayerDetail(player.id);
        }
    };

    if (loading && activeTab === 'PLAYERS') return <div className="loading">Fetching Cricket Stars...</div>;

    return (
        <section className="players-section" id="team-section">
            <div className="section-header">
                <div>
                    <h2>{(activeTab === 'PLAYERS') ? 'CRICKET TEAM' : 'SERIES SQUADS'}</h2>
                    <div className="tab-switcher">
                        <button className={activeTab === 'PLAYERS' ? 'active' : ''} onClick={() => setActiveTab('PLAYERS')}>PLAYERS</button>
                        <button className={activeTab === 'SQUADS' ? 'active' : ''} onClick={() => setActiveTab('SQUADS')}>SQUADS</button>
                    </div>
                </div>
                {activeTab === 'PLAYERS' && (
                    <form className="search-box" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search players..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" disabled={searching}>
                            {searching ? '...' : '🔍'}
                        </button>
                    </form>
                )}
            </div>

            {activeTab === 'PLAYERS' ? (
                <div className="players-grid">
                    {players.length > 0 ? (
                        players.map((player, index) => (
                            <div
                                className="player-card animate-fade-in-up"
                                key={player.id || index}
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => openPlayer(player)}
                            >
                                <div className="player-image">
                                    <img
                                        src={player.photo || `https://www.royalchallengers.com/themes/custom/rcb/assets/images/rcb-placeholder.jpg`}
                                        alt={player.name}
                                        onError={(e) => { e.target.src = 'https://www.royalchallengers.com/themes/custom/rcb/assets/images/rcb-placeholder.jpg' }}
                                    />
                                    <div className="player-country">{player.country}</div>
                                </div>
                                <div className="player-info">
                                    <h3>{player.name}</h3>
                                    <p className="player-role">{player.role || 'Cricket Player'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-players">No players found. Try a different search term.</div>
                    )}
                </div>
            ) : (
                <div className="squads-coming-soon animate-fade-in-up">
                    <div className="coming-soon-card">
                        <div className="coming-icon">👷‍♂️</div>
                        <h3>SQUADS API COMING SOON</h3>
                        <p>The Series Squad List API is currently under development by the provider. We will integrate it as soon as it goes live!</p>
                        <button className="back-btn" onClick={() => setActiveTab('PLAYERS')}>GO TO PLAYERS</button>
                    </div>
                </div>
            )}

            {selectedPlayer && (
                <div className="news-modal" onClick={() => setSelectedPlayer(null)}>
                    <div className="modal-content animate-fade-in-up" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedPlayer(null)}>&times;</button>

                        <div className="player-detail-header" style={{ padding: '40px', background: 'var(--rcb-gray)', display: 'flex', gap: '30px', alignItems: 'center' }}>
                            <div className="p-detail-img" style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '5px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                {fetchingDetails ? (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>...</div>
                                ) : (
                                    <img
                                        src={selectedPlayer.photo || playerDetails?.playerImg || `https://www.royalchallengers.com/themes/custom/rcb/assets/images/rcb-placeholder.jpg`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://www.royalchallengers.com/themes/custom/rcb/assets/images/rcb-placeholder.jpg' }}
                                    />
                                )}
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--rcb-red)', textTransform: 'uppercase' }}>{selectedPlayer.country}</span>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '5px 0' }}>{selectedPlayer.name}</h2>
                                <p style={{ color: '#64748b', fontWeight: '600' }}>{playerDetails?.role || selectedPlayer.role || 'Cricket Player'}</p>
                            </div>
                        </div>

                        <div className="p-detail-body" style={{ padding: '40px' }}>
                            {fetchingDetails ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Loading player profile...</div>
                            ) : playerDetails ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="stat-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Born</span>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{playerDetails.dateOfBirth || 'N/A'}</span>
                                    </div>
                                    <div className="stat-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Place</span>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{playerDetails.placeOfBirth || 'N/A'}</span>
                                    </div>
                                    <div className="stat-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Batting</span>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{playerDetails.battingStyle || 'N/A'}</span>
                                    </div>
                                    <div className="stat-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Bowling</span>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{playerDetails.bowlingStyle || 'N/A'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details. Please try again.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Players;
