import React from 'react';
import {  useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/cves/list');
  };

  return (
    <div style={styles.container}>
      <h1>404 - Not Found</h1>
      <button onClick={navigateToHome} style={styles.button}>
        Go to CVEs
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default NotFoundPage;
