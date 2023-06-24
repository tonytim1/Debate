import React from 'react';
import { Grid } from '@mui/material';
import './VideoGrid.css'; // Import your CSS styles for the VideoGrid component

const VideoGrid = ({ users }) => {
  const renderVideoGrid = () => {
    return users.map((user) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
        <div className="video">
          {/* Render video element or user information */}
          {/* For example: <video src={user.videoSrc} autoPlay /> */}
          <span>{user}</span>
        </div>
      </Grid>
    ));
  };

  return (
    <Grid container spacing={2} className="video-grid">
      {renderVideoGrid()}
    </Grid>
  );
};

export default VideoGrid;
