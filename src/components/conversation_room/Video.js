import React, { useEffect, useRef } from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';

const Video = ({ peer }) => {
  const refVideo = useRef();

  useEffect(() => {
    console.log("the other video is", peer, peer.userId)
    peer.peer.on('stream', (stream) => {
      console.log("other video sent stream!");
      refVideo.current.srcObject = stream;
    });
  }, []);

  if (!peer || peer.from == "addPeer") {
    console.log("not showing addPeer");
    return (<></>);
  }

  return (
    <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom>{peer.userId || 'Uknown'}</Typography>
        <video autoPlay playsInline ref={refVideo} width="160" height="120" />
     </Grid>
  );
};

export default Video;
