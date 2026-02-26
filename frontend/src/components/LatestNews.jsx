import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LatestNews.css';

const LatestNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cricket-news');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const openNews = (item) => {
        setSelectedNews(item);
    };

    if (loading) return <div className="loading">Loading Latest Stories...</div>;

    return (
        <section className="news-section" id="news-section">
            <div className="section-header">
                <h2>LATEST NEWS</h2>
                <a href="#" className="view-all">VIEW ALL</a>
            </div>

            <div className="news-grid">
                {news.map((item, index) => (
                    <div
                        className="news-card animate-fade-in-up"
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => openNews(item)}
                    >
                        <div className="news-image">
                            <img src={item.image} alt={item.title} />
                            <div className="news-date">{item.date}</div>
                        </div>
                        <div className="news-content">
                            <h3>{item.title}</h3>
                            <p>{item.description?.substring(0, 100)}...</p>
                            <span className="read-more">
                                READ STORY →
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedNews && (
                <div className="news-modal" onClick={() => setSelectedNews(null)}>
                    <div className="modal-content animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedNews(null)}>&times;</button>
                        <img src={selectedNews.image} alt="" className="modal-image" />
                        <div className="modal-body">
                            <span className="modal-date">{selectedNews.date}</span>
                            <h2>{selectedNews.title}</h2>
                            <p className="modal-desc">{selectedNews.description}</p>
                            <div className="full-content-notice">
                                Full coverage available at
                                <a href={selectedNews.url} target="_blank" rel="noreferrer"> the original source</a>.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LatestNews;
