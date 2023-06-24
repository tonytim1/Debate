import React, { useEffect, useRef } from 'react';
import { Grid, Typography } from '@mui/material';

const Video = ({ peer }) => {
  const refVideo = useRef();

  useEffect(() => {
    console.log("the other video is", peer, peer.userId)
    peer.peer.on('stream', (stream) => {
      console.log("other video sent stream!");
      refVideo.current.srcObject = stream;
    });
  }, []);

  return (
    <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom style={{position:'absolute'}}>{peer.userId || 'Uknown'}</Typography>
        <video autoPlay playsInline ref={refVideo} />
     </Grid>
  );
};

export default Video;
