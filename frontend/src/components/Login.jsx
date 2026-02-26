import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await axios.post(`${endpoint}`, formData);

            setMessage({ type: 'success', text: isLogin ? 'Login Successful!' : 'Registration Successful!' });

            if (isLogin) {
                // Pass user data up to App component
                setTimeout(() => {
                    if (onLoginSuccess) onLoginSuccess(response.data.user || { email: formData.email });
                }, 1000);
            } else {
                // After registration, maybe just log them in or switch to login mode
                setTimeout(() => {
                    setIsLogin(true);
                    setMessage({ type: 'success', text: 'Registration Successful! Please login.' });
                }, 1500);
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card-wrapper animate-fade-in-up">
                <div className="login-header">
                    <img src="/assets/stadium-stories-logo.jpg" alt="Logo" className="login-logo" />
                    <h2>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
                    <p>{isLogin ? 'Enter your credentials to access your account' : 'Join the Stadium Stories community today'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Virat Kohli"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="virat@rcb.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {message.text && (
                        <div className={`form-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
