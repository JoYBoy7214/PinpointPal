// src/pages/Signup.js
import React, { useState } from 'react';
import { signupUser } from '../api/auth';
import './Auth.css'; // Use same CSS as Login

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signupUser(formData);
      alert('Signup successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}

export default Signup;
