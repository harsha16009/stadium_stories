import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeriesList.css';

const SeriesList = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/series');
                setSeries(response.data);
            } catch (error) {
                console.error('Error fetching series:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeries();
    }, []);

    if (loading) return <div className="series-loading">Loading Upcoming Series...</div>;

    return (
        <section className="series-section">
            <div className="section-header">
                <h2>FEATURED SERIES</h2>
            </div>

            <div className="series-container">
                {series.map((item, index) => (
                    <div
                        className="series-card animate-fade-in-up"
                        key={index}
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <div className="series-info">
                            <h3>{item.name}</h3>
                            <div className="series-meta">
                                <span>🗓 {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</span>
                                <div className="format-tags">
                                    {item.odt > 0 && <span className="tag odi">ODI</span>}
                                    {item.t20 > 0 && <span className="tag t20">T20</span>}
                                    {item.test > 0 && <span className="tag test">TEST</span>}
                                </div>
                            </div>
                        </div>
                        <div className="series-stats">
                            <div className="stat">
                                <span className="count">{item.matches}</span>
                                <span className="label">Matches</span>
                            </div>
                            <div className="stat">
                                <span className="count">{item.squads}</span>
                                <span className="label">Squads</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SeriesList;
