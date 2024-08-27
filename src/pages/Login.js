import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registerUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isRegistering) {
        response = await registerUser(username, password);
        if (response.status === 200) {
          setMessage('User registered successfully');
          setTimeout(() => {
            setIsRegistering(false);
          }, 2000);
        } else {
          setMessage(response.data?.message || 'Error registering user');
        }
      } else {
        response = await login(username, password);
        if (response.status === 200) {
          console.log(response);
          localStorage.setItem('authToken', response.data);
          localStorage.setItem('username', username);
          navigate('/calculator');
        } else {
          setMessage(response.data?.message || 'Error logging in');
        }
      }
    } catch (error) {
      console.error(isRegistering ? 'Registration failed:' : 'Login failed:', error);
      setMessage(isRegistering ? 'Error registering user' : 'Error logging in');
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="text-center">{isRegistering ? 'Register' : 'Login'}</h1>
        {message && <div className="message text-center">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <span>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
