import React from 'react'
import { Stack, Button } from '@mui/material';


const RoomFull = () => {
  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Adjust the height to fit your requirements
    }}
  >
    <Stack>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'blue',
        }}
      >
        Sorry, The Room Is Full
      </div>
      <Button variant="contained" href='/'>
        Go Back to Home
      </Button>
    </Stack>
    </div>
  );
};

export default RoomFull