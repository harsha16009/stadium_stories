import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Matches.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [currentMatches, setCurrentMatches] = useState([]);
    const [worldCupMatches, setWorldCupMatches] = useState([]);
    const [flags, setFlags] = useState({});
    const [view, setView] = useState('ALL'); // 'ALL', 'CURRENT', or 'WC'
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchDetails, setMatchDetails] = useState(null);
    const [fetchingDetails, setFetchingDetails] = useState(false);

    const fetchMatchInfo = async (id) => {
        setFetchingDetails(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/match-info?id=${id}`);
            setMatchDetails(response.data);
        } catch (error) {
            console.error('Error fetching match details:', error);
        } finally {
            setFetchingDetails(false);
        }
    };

    const openMatch = (match) => {
        setSelectedMatch(match);
        setMatchDetails(null);
        fetchMatchInfo(match.id);
    };

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const [matchesRes, currentRes, wcRes, countriesRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/matches'),
                    axios.get('http://localhost:5000/api/current-matches'),
                    axios.get('http://localhost:5000/api/t20-world-cup-matches'),
                    axios.get('http://localhost:5000/api/countries')
                ]);

                setMatches(matchesRes.data || []);
                setCurrentMatches(currentRes.data || []);
                setWorldCupMatches(Array.isArray(wcRes.data) ? wcRes.data : (wcRes.data?.matchList || []));

                // Process countries into a lookup map for easy flag access
                if (countriesRes.data && Array.isArray(countriesRes.data)) {
                    const flagMap = {};
                    countriesRes.data.forEach(c => {
                        flagMap[c.name] = c.genericFlag;
                    });
                    setFlags(flagMap);
                }

            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const displayMatches = view === 'ALL' ? matches : (view === 'CURRENT' ? currentMatches : worldCupMatches);

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'Date TBD';
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr || 'Date TBD';
        }
    };

    if (loading) return (
        <div className="matches-container">
            <div className="loading" style={{ textAlign: 'center', padding: '100px' }}>
                <div className="spinner"></div>
                <p>Retrieving Cricket Charms...</p>
            </div>
        </div>
    );

    return (
        <div className="matches-container animate-fade-in-up">
            <div className="matches-header">
                <div className="view-selector">
                    <button
                        className={view === 'ALL' ? 'active' : ''}
                        onClick={() => setView('ALL')}
                    >
                        ALL MATCHES
                    </button>
                    <button
                        className={view === 'CURRENT' ? 'active' : ''}
                        onClick={() => setView('CURRENT')}
                    >
                        LIVE / CURRENT
                    </button>
                    <button
                        className={view === 'WC' ? 'active' : ''}
                        onClick={() => setView('WC')}
                    >
                        🏆 T20 WORLD CUP
                    </button>
                </div>
            </div>

            <div className="matches-grid">
                {displayMatches && displayMatches.length > 0 ? (
                    displayMatches.map((match, index) => (
                        <div
                            className="match-card animate-fade-in-up"
                            key={match.id || index}
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => openMatch(match)}
                        >
                            <div className="match-status-tag">{match.status || 'Scheduled'}</div>
                            <div className="match-card-header">
                                <span className="match-type">{(match.matchType || match.type || 'Match').toUpperCase()}</span>
                                <span className="match-date">{formatDate(match.dateTimeGMT || match.date)}</span>
                            </div>
                            <h3 className="match-name">{match.name}</h3>
                            <div className="match-venue">📍 {match.venue || 'Venue TBD'}</div>
                            <div className="match-teams">
                                {(match.teams || []).length > 0 ? (
                                    <>
                                        {match.teams.map((team, i) => (
                                            <div key={i} className="team-row">
                                                <div className="team-info-row">
                                                    <span className="team-tag">
                                                        {flags[team] && <img src={flags[team]} alt="" className="team-flag-icon" />}
                                                        {team}
                                                    </span>
                                                    {match.score && match.score[i] && (
                                                        <span className="team-score-info">
                                                            {match.score[i].r}/{match.score[i].w} ({match.score[i].o} ov)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {/* If no score array but status has info, show status under teams */}
                                        {(!match.score || match.score.length === 0) && (
                                            <div className="match-summary-status">
                                                {match.status}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="team-tag">Teams TBD</div>
                                )}
                            </div>
                            {match.fantasyEnabled && (
                                <div className="fantasy-badge">Fantasy Ready ⚡</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-matches">
                        <div className="empty-state-icon">🏏</div>
                        <h3>No {view === 'WC' ? 'T20 World Cup' : (view === 'CURRENT' ? 'Live' : 'Scheduled')} matches found.</h3>
                        <p>Stay tuned for upcoming international fixtures!</p>
                    </div>
                )}
            </div>

            {selectedMatch && (
                <div className="news-modal" onClick={() => setSelectedMatch(null)}>
                    <div className="modal-content animate-fade-in-up" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedMatch(null)}>&times;</button>

                        <div className="match-detail-header" style={{ padding: '40px', background: 'var(--rcb-gray)' }}>
                            <span className="modal-date">{formatDate(selectedMatch.dateTimeGMT || selectedMatch.date)}</span>
                            <h2 style={{ fontSize: '28px', margin: '10px 0', color: '#0f172a' }}>{selectedMatch.name}</h2>
                            <p style={{ color: 'var(--rcb-red)', fontWeight: '800', letterSpacing: '1px' }}>
                                {(selectedMatch.matchType || 'CRICKET MATCH').toUpperCase()}
                            </p>
                        </div>

                        <div className="match-detail-body" style={{ padding: '40px' }}>
                            {fetchingDetails ? (
                                <div className="loading" style={{ padding: '20px' }}>Fetching Match Details...</div>
                            ) : (
                                <>
                                    <div className="m-detail-status" style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginBottom: '30px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Current Status</div>
                                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{matchDetails?.status || selectedMatch.status}</div>
                                    </div>

                                    <div className="teams-comparison" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                        <div className="team-box" style={{ textAlign: 'center' }}>
                                            {flags[selectedMatch.teams?.[0]] && (
                                                <img src={flags[selectedMatch.teams?.[0]]} alt="" style={{ width: '40px', height: '30px', objectFit: 'contain', marginBottom: '10px', borderRadius: '4px' }} />
                                            )}
                                            <div className="t-name" style={{ fontSize: '18px', fontWeight: '900', marginBottom: '10px' }}>{selectedMatch.teams?.[0]}</div>
                                            {matchDetails?.score?.[0] && (
                                                <div className="t-score" style={{ fontSize: '24px', fontWeight: '900', color: 'var(--rcb-red)' }}>
                                                    {matchDetails.score[0].r}/{matchDetails.score[0].w}
                                                    <span style={{ fontSize: '14px', color: '#94a3b8', display: 'block' }}>({matchDetails.score[0].o} ov)</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="vs-badge" style={{ padding: '10px', background: '#f1f5f9', borderRadius: '50%', fontWeight: '900', color: '#94a3b8' }}>VS</div>
                                        <div className="team-box" style={{ textAlign: 'center' }}>
                                            {flags[selectedMatch.teams?.[1]] && (
                                                <img src={flags[selectedMatch.teams?.[1]]} alt="" style={{ width: '40px', height: '30px', objectFit: 'contain', marginBottom: '10px', borderRadius: '4px' }} />
                                            )}
                                            <div className="t-name" style={{ fontSize: '18px', fontWeight: '900', marginBottom: '10px' }}>{selectedMatch.teams?.[1]}</div>
                                            {matchDetails?.score?.[1] && (
                                                <div className="t-score" style={{ fontSize: '24px', fontWeight: '900', color: 'var(--rcb-red)' }}>
                                                    {matchDetails.score[1].r}/{matchDetails.score[1].w}
                                                    <span style={{ fontSize: '14px', color: '#94a3b8', display: 'block' }}>({matchDetails.score[1].o} ov)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="venue-info" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                            <span style={{ fontSize: '24px' }}>📍</span>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Venue</div>
                                                <div style={{ fontWeight: '700', color: '#1e293b' }}>{selectedMatch.venue}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Matches;
