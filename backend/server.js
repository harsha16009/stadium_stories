const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Optional for now)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rcb_universe';
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => {
            console.log('MongoDB Connection Error (Server will still run):', err.message);
        });
}

// Basic Route
app.get('/', (req, res) => {
    res.send('stadium stories  API Running');
});

// Sample News Route
app.get('/api/news', (req, res) => {
    const news = [
        { id: 1, title: "I'M WORKING REALLY HARD - SHIVAM DUBE", date: "3 days ago", tag: "Interview" },
        { id: 2, title: "RCB Women start campaign with a win", date: "FEB 05 - 2026", tag: "Match Report" }
    ];
    res.json(news);
});

// Real Cricket News Route
app.get('/api/cricket-news', async (req, res) => {
    try {
        const API_KEY = process.env.NEWS_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: 'News API Key is missing.' });
        }

        const response = await axios.get(`https://newsapi.org/v2/everything?q=cricket&sortBy=publishedAt&apiKey=${API_KEY}`);

        const articles = response.data.articles.slice(0, 6).map(art => ({
            title: art.title,
            description: art.description,
            image: art.urlToImage || 'https://www.royalchallengers.com/themes/custom/rcb/assets/images/rcb-placeholder.jpg',
            date: new Date(art.publishedAt).toLocaleDateString(),
            url: art.url
        }));

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Real Player Data Route (CricAPI)
app.get('/api/players', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { offset = 0, search = '' } = req.query;

        let url = `https://api.cricapi.com/v1/players?apikey=${API_KEY}&offset=${offset}`;
        if (search) {
            url += `&search=${search}`;
        }

        const response = await axios.get(url);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error: ' + (response.data.reason || 'Unknown error') });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching players:', error.message);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

// Matches Route (CricAPI matches)
app.get('/api/matches', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { offset = 0 } = req.query;
        const response = await axios.get(`https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=${offset}`);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error' });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

// Current Matches Route (CricAPI currentMatches)
app.get('/api/current-matches', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const response = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}`);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error' });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching current matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch current matches' });
    }
});

// Live Scores Ticker Route (CricAPI cricScore) - keeping for the top ticker functionality
app.get('/api/live-scores', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const response = await axios.get(`https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`);
        res.json(response.data.data.slice(0, 8));
    } catch (error) {
        console.error('Error fetching live scores:', error.message);
        res.status(500).json({ error: 'Failed to fetch live scores' });
    }
});

// Cricket Series Route (CricAPI series)
app.get('/api/series', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { offset = 0 } = req.query;
        const response = await axios.get(`https://api.cricapi.com/v1/series?apikey=${API_KEY}&offset=${offset}`);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error' });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching series:', error.message);
        res.status(500).json({ error: 'Failed to fetch series data' });
    }
});

// T20 World Cup Specific Matches Route (Fallback to generic matches if specific series error)
app.get('/api/t20-world-cup-matches', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const T20_WC_ID = 'f3e5c7dd-332c-4893-9067-aa2bffe6d2b85'; // Static ID, might be invalid

        try {
            const response = await axios.get(`https://api.cricapi.com/v1/series_matches?apikey=${API_KEY}&id=${T20_WC_ID}`);
            if (response.data.status === 'success' && response.data.data && response.data.data.matchList) {
                return res.json(response.data.data.matchList);
            }
        } catch (ignoredError) {
            // Ignore specific series error to fallback below
        }

        // Fallback: Just return some generic T20 matches or all matches so the section isn't empty
        const fbResponse = await axios.get(`https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0`);
        if (fbResponse.data.status === 'success') {
            const t20Matches = fbResponse.data.data.filter(m => m.matchType === 't20' || m.matchType === 'odi').slice(0, 10);
            return res.json(t20Matches);
        }

        res.json([]);
    } catch (error) {
        console.error('Error fetching WC matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch World Cup matches' });
    }
});

// Player info route for photos and details
app.get('/api/player-info', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Player ID required' });

        const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=${API_KEY}&id=${id}`);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error' });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching player info:', error.message);
        res.status(500).json({ error: 'Failed to fetch player info' });
    }
});

// Match Details Route
app.get('/api/match-info', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Match ID required' });

        const response = await axios.get(`https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&id=${id}`);
        if (response.data.status !== 'success') return res.status(500).json({ error: 'CricAPI error' });
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Series Details Route
app.get('/api/series-info', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Series ID required' });

        const response = await axios.get(`https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&id=${id}`);
        if (response.data.status !== 'success') return res.status(500).json({ error: 'CricAPI error' });
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Countries Route (CricAPI countries) for Flags
app.get('/api/countries', async (req, res) => {
    try {
        const API_KEY = process.env.CRIC_API_KEY;
        const response = await axios.get(`https://api.cricapi.com/v1/countries?apikey=${API_KEY}`);

        if (response.data.status !== 'success') {
            return res.status(500).json({ error: 'CricAPI error' });
        }
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching countries:', error.message);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Serve frontend in production
const path = require('path');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
