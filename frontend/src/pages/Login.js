import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/main.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get CSRF token on component load
  useEffect(() => {
    axios.get('http://localhost:8000/api/accounts/csrf/', { withCredentials: true });
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = Cookies.get('csrftoken');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/accounts/login/',
        credentials,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
          }
        }
      );

      const { role, username } = res.data;
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);

      setMessage('✅ Login successful!');

      // Redirect based on user role
      setTimeout(() => {
        if (role === 'patient') {
          navigate('/dashboard/patient');
        } else if (role === 'doctor') {
          navigate('/dashboard/doctor');
        } else if (role === 'receptionist') {
          navigate('/dashboard/receptionist');
        } else {
          navigate('/login'); // fallback
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage('❌ Login failed. Check your credentials.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="topnav">
        <span className="brand">Healthcare App</span>
      </div>

      <div className="container-center">
        <form className="form-box" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {message && <p className="message">{message}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          <p style={{ marginTop: '10px' }}>
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
