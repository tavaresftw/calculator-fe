import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecords, fetchBalanceFromServer, deleteRecord } from '../services/api';
import '../components/styles.css';

const Records = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  const [records, setRecords] = useState([]);
  const [balance, setBalance] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('desc');
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const fetchRecords = useCallback(async () => {
    try {
      if (authToken && username) {
        const totalRecordsResponse = await getRecords(username, authToken, 0, 200, sortBy, direction, search);
        if (totalRecordsResponse.status === 200) {
          const totalRecords = totalRecordsResponse.data.length;
          const totalPagesCalculated = Math.ceil(totalRecords / size);
          setTotalPages(totalPagesCalculated);
        }

        const response = await getRecords(username, authToken, page, size, sortBy, direction, search);
        if (response.status === 200) {
          setRecords(response.data || []);
        }

        const balanceResponse = await fetchBalanceFromServer(authToken, username);
        if (balanceResponse.status === 200) {
          setBalance(balanceResponse.data.balance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }, [authToken, username, page, size, sortBy, direction, search]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleDirectionChange = (e) => {
    setDirection(e.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteRecord(id, authToken);
      if (response.status === 200) {
        setRecords(records.filter(record => record.id !== id));
      } else {
        console.error('Failed to delete record:', response.status);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

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
        <div className="filters customer-input">
          <input
            type="text" 
            placeholder="Search..." 
            value={search} 
            onChange={handleSearchChange}
            style={{ 
              height: '22px',
              width: '10%',
              padding: '0 8px',
              boxSizing: 'border-box' 
            }}
          />
          <select value={size} onChange={handleSizeChange}>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="30">30 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="id">ID</option>
            <option value="operation">Operation Type</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
          </select>
          <select value={direction} onChange={handleDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Operation Type</th>
              <th>Amount</th>
              <th>Response</th>
              <th>Date</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map(record => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.operationType}</td>
                  <td>{record.amount}</td>
                  <td>{record.operationResponse}</td>
                  <td>{record.date}</td>
                  <td>{record.userBalance}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-danger btn-trash" 
                      onClick={() => handleDelete(record.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-controls container-menu-pags">
          <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>
            Previous
          </button>
          <div className="page-numbers">
            {pageNumbers.map(num => (
              <button
                key={num}
                className={`btn btn-sm ${page === num ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handlePageChange(num)}
              >
                {num + 1}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Records;
