import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Stack } from '@mui/material';


const LoadingScreen = () => {
    return (
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', 
        }}
      >
        <Stack style={{alignItems: 'center'}}>
          <div style={{ fontSize: '24px', color: 'blue' }}>
            Loading...
          </div>
          <CircularProgress />
        </Stack>
      </div>
      );
};

export default LoadingScreen