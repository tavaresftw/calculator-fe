import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBalanceFromServer, logout } from '../services/api';
import '../components/styles.css';

const Menu = () => {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetchBalanceFromServer(authToken, username);
      if (response.status === 200) {
        setBalance(response.data.balance);
      }
    } catch (err) {
      console.error('Error fetching balance', err);
    }
  }, [authToken, username]);

  useEffect(() => {
    if (authToken && username) {
      fetchBalance();
    }
  }, [authToken, username, fetchBalance]);

  const handleLogout = async () => {
    try {
      const response = await logout(authToken);
      if (response.status === 200) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
      } else {
        console.error('Error logging out');
      }
    } catch (err) {
      console.error('Error logging out', err);
    }
  };

  return (
    <div className="container-menu-tes">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/calculator">Calculator</a>
        <a className="nav-link" href="/records">Records</a>
        <span className="navbar-text ms-auto">
          Hello, {username} | Balance: ${balance.toFixed(2)}
        </span>
        <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
          Sign out
        </button>
      </nav>
    </div>
  );
};

export default Menu;