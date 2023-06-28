import React, { useEffect, useRef } from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';

const VideoBox = ({ me, peer }) => {
  const refVideo = useRef();

  useEffect(() => {
    if (!me){
      console.log("the other video is", peer, peer.userId)
      peer.peer.on('stream', (stream) => {
        console.log("other video sent stream!");
        refVideo.current.srcObject = stream;
    });}
  }, []);

  if (!peer || peer.from == "addPeer") {
    console.log("not showing addPeer");
    return null;
  }

  return (
    <div>
      <Typography
        variant="h4" 
        style={{
          position: 'absolute',
          marginLeft: '15px',
          marginTop: '15px',
          color: 'black',
          borderRadius: '12px',
          backgroundColor: '#ffffff73',
          padding: '3px',
        }}>
          {me ? "You" : (peer.userId || 'Uknown')}
      </Typography>

      {me ? (
        <video muted autoPlay playsInline ref={peer} width="100%" style={{borderRadius:"30px"}}/>
      ) : (
        <video autoPlay playsInline ref={refVideo} width="100%" style={{borderRadius:"30px"}}/>
      )}
    </div>
  );
};

export default VideoBox;
