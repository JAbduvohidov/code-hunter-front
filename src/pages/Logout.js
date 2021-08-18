import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Logout = () => {
  const navigate = useNavigate();

  const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common.Authorization;
  };

  useEffect(() => {
    clearSession();
    navigate('/questions', { replace: true });
  }, []);

  return (
    <>
    </>
  );
};

export default Logout;
