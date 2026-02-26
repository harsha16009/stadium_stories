const axios = require('axios');
require('dotenv').config();

async function test() {
    try {
        const API_KEY = '655888b7aa5546c2ae76b614f068028a';
        console.log('Testing API Key:', API_KEY);
        const response = await axios.get(`https://newsapi.org/v2/everything?q=cricket&apiKey=${API_KEY}`);
        console.log('Status:', response.status);
        console.log('Articles found:', response.data.articles.length);
    } catch (error) {
        if (error.response) {
            console.log('Error Data:', error.response.data);
        } else {
            console.log('Error Message:', error.message);
        }
    }
}

test();
