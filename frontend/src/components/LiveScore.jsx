import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LiveScore.css';

const LiveScore = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get('/api/live-scores');
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="score-loading">SYNCING LIVE SCORES...</div>;

    return (
        <div className="live-score-ticker">
            <div className="ticker-label">
                <span className="dot-live"></span> LIVE MATCHES
            </div>
            <div className="ticker-scroll">
                {matches.length > 0 ? (
                    matches.map((match, index) => (
                        <div className="ticker-item" key={index}>
                            <div className="match-info-top">
                                <span className="match-type-badge">{match.matchType?.toUpperCase() || "MATCH"}</span>
                                <span className="match-desc">{match.status}</span>
                            </div>
                            <div className="match-teams-row">
                                <div className="team-score">
                                    <span className="team-name-short">{match.t1}</span>
                                    {match.t1s && <span className="score-val">{match.t1s}</span>}
                                </div>
                                <div className="vs-sep">VS</div>
                                <div className="team-score">
                                    {match.t2s && <span className="score-val">{match.t2s}</span>}
                                    <span className="team-name-short">{match.t2}</span>
                                </div>
                            </div>
                            {/* If scores are missing, ensure status is clear */}
                            {(!match.t1s && !match.t2s) && (
                                <div className="match-status-fallback">
                                    {match.status}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="ticker-empty">No active matches currently scheduled</div>
                )}
            </div>
        </div>
    );
};

export default LiveScore;
