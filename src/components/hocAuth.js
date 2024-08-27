import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
      if (!authToken) {
        navigate('/login');
      }
    }, [authToken, navigate]);

    return authToken ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
