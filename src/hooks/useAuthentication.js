import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthentication = () => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const UserAuthenticated = localStorage.getItem('UserAuthenticated');
    if(UserAuthenticated === 'true') setIsAuthenticated(true);
    else setIsAuthenticated(false);
    //eslint-disable-next-line
  }, [ location.pathname ]);

  return isAuthenticated ;
}

export default useAuthentication;
