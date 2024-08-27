import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecords, fetchBalanceFromServer } from '../services/api';

const Records = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  const [records, setRecords] = useState([]);
  const [balance, setBalance] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const fetchRecords = useCallback(async (page, size) => {
    try {
      if (authToken && username) {
        const response = await getRecords(username, authToken, page, size);
        if (response.status === 200) {
          setRecords(response.data);
        }
        const balanceResponse = await fetchBalanceFromServer(authToken, username);
        if (balanceResponse.status === 200) {
          setBalance(balanceResponse.data.balance);
        }
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }, [authToken, username]);

  useEffect(() => {
    fetchRecords(page, size);
  }, [fetchRecords, page, size]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light menu-spacing">
        <div className="container-menu-tes">
          <button className="btn btn-link" onClick={() => navigate('/calculator')}>Calculator</button>
          <button className="btn btn-link" onClick={() => navigate('/records')}>Records</button>
          <span className="navbar-text ms-3">
            Balance: ${balance.toFixed(2)}
          </span>
          <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>
      <div className="table-container">
        <h1>Operation Records</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Operation Type</th>
              <th>Amount</th>
              <th>Response</th>
              <th>Date</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.operationType}</td>
                <td>{record.amount}</td>
                <td>{record.operationResponse}</td>
                <td>{record.date}</td>
                <td>{record.userBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls">
          <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>
            Previous
          </button>
          <span className="page-info">Page {page + 1}</span>
          <button className="btn btn-primary" onClick={handleNextPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Records;