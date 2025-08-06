// src/pages/Login.js
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import './Auth.css'; // Use if you extract shared styles
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/mapview');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
    </div>
  );
}

export default Login;
