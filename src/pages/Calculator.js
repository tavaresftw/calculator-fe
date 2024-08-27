import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { performOperation, fetchBalanceFromServer } from '../services/api';
import withAuth from '../components/hocAuth';
import '../components/styles.css';

const Calculator = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operationType, setOperationType] = useState('ADDITION');
  const [result, setResult] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetchBalanceFromServer(authToken, username);
      if (response.status === 200) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [authToken, username]);

  useEffect(() => {
    if (authToken && username) {
      fetchBalance();
    }
  }, [authToken, username, fetchBalance]);

  const handleOperation = async (e) => {
    e.preventDefault();
    setError('');

    if (operationType === 'DIVISION' && num2 === '0') {
      setError('Cannot divide by zero.');
      return;
    }
    if (operationType === 'SQUARE_ROOT' && num1 < '0') {
      setError('Cannot calculate the square root of a negative number.');
      return;
    }
    if (operationType === 'RANDOM_STRING' && (num1 < '1' || num1 > '32')) {
      setError('String length must be between 1 and 32.');
      return;
    }

    try {
      const response = await performOperation({ operationType, num1, num2 }, authToken);
      setResult(response.data);
      const balanceResponse = await fetchBalanceFromServer(authToken, username);
      setBalance(balanceResponse.data.balance);
    } catch (error) {
      console.error('Operation failed:', error);
      setError('Operation failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light menu-spacing">
        <div className="container-menu-tes">
          <button className="btn btn-link" onClick={() => navigate('/calculator')}>Calculator</button>
          <button className="btn btn-link" onClick={() => navigate('/records')}>Records</button>
          <span className=".navbar-text ms-3">
            Balance: ${balance.toFixed(2)}
          </span>
          <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>
      <div className="calculator-container">
        <h1>Calculator</h1>
        <form onSubmit={handleOperation}>
          <div className="mb-3">
            {operationType !== 'RANDOM_STRING' && (
              <input
                type="number"
                className="form-control"
                placeholder={operationType === 'SQUARE_ROOT' ? 'Number' : 'Number 1'}
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                required
                disabled={operationType === 'SQUARE_ROOT' && num2}
              />
            )}
          </div>
          {(operationType === 'ADDITION' || operationType === 'SUBTRACTION' || operationType === 'MULTIPLICATION' || operationType === 'DIVISION') && (
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Number 2"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                required={operationType !== 'SQUARE_ROOT' && operationType !== 'RANDOM_STRING'}
                disabled={operationType === 'SQUARE_ROOT' || operationType === 'RANDOM_STRING'}
              />
            </div>
          )}
          {operationType === 'RANDOM_STRING' && (
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="String Length (1~32)"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <select
              className="form-select"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
            >
              <option value="ADDITION">Addition</option>
              <option value="SUBTRACTION">Subtraction</option>
              <option value="MULTIPLICATION">Multiplication</option>
              <option value="DIVISION">Division</option>
              <option value="SQUARE_ROOT">Square Root</option>
              <option value="RANDOM_STRING">Random String</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Calculate</button>
        </form>
        {error && <div className="mt-3 text-danger">{error}</div>}
        {result && <div className="mt-3">Result: {result}</div>}
      </div>
    </div>
  );
};

export default withAuth(Calculator);
