import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthenticated = () => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) setIsAuthenticated(true);
    else setIsAuthenticated(false);
    //eslint-disable-next-line
  }, [ location.pathname ]);

  return isAuthenticated ;
}

export default useAuthenticated;
