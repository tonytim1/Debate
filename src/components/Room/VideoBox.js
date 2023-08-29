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
    <div style={{
      display: 'grid',
      placeItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
        <Typography
          variant="h4" 
          style={{
            position: 'absolute',
            marginTop: '8px',
            color: 'black',
            borderRadius: '12px',
            backgroundColor: '#ffffff73',
            padding: '3px',
          }}>
            {me ? "You" : (peer.userId || 'Uknown')}
        </Typography>
      </div>
      {me ? (
        <video muted autoPlay playsInline ref={peer} width="auto" style={{borderRadius:"30px", maxWidth:'80%'}}/>
      ) : (
        <video autoPlay playsInline ref={refVideo} width="auto" style={{borderRadius:"30px", maxWidth:'80%'}}/>
      )}
    </div>
  );
};

export default VideoBox;
