import React, { useEffect, useRef } from 'react';
import { Grid, Typography } from '@mui/material';

const Video = ({ peer, name }) => {
  const refVideo = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
        refVideo.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
        <video autoPlay playsInline ref={refVideo} />
     </Grid>
  );
};

export default Video;
