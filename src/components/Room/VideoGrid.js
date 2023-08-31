import React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2;
import './VideoGrid.css'; // Import your CSS styles for the VideoGrid component
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VideoBox from './VideoBox';
import { useEffect, useState } from 'react';

const VideoGrid = ({ myVideo, peers, isSpectator }) => {
  const [numOfVids, setNumOfVids] = useState(myVideo !== null ? peers.length + 1 : peers.length);
  const calcGrid = (n) => {
    const gridMap = [];

    let remaining = n;
    let row = 0;

    while (remaining > 0) {
      if (remaining <= 2) {
        gridMap.push(remaining);
        break;
      }
      if (remaining === 3 && gridMap.length !== 0) {
        gridMap.push(3);
        break;
      }

      // const remaining >= 5 ? 2 : 3;
      const cols = remaining >= 5 ? 3 : 2;

      gridMap.push(cols);

      remaining -= cols;

      row++;
    }
    return gridMap;
  }

  useEffect(() => {
    setNumOfVids(myVideo !== null ? peers.length + 1 : peers.length);
    console.log("numOfVids", numOfVids);
  }, [peers]);
  
  if (!myVideo || !peers) return null;
  return (
    <div style={{overflow: 'auto', display: 'grid', gridTemplateColumns: `repeat(${numOfVids <= 4 ? 2 : 3}, 1fr)`, gridAutoRows: `1fr`, height: '95%', alignItems: 'center', gridGap:'15px'}}>
      {!isSpectator && myVideo !== null ? (
        <VideoBox me={true} peer={myVideo}/>
      ) : null}
      {peers.map((peer) => (
        <VideoBox me={false} peer={peer}/>
      ))}
      {/* <Skeleton variant="rectangular" height="100px" width="30%" style={{flex:'1 1 30%'}} />
      <Skeleton variant="rectangular" height="100px" width="30%" style={{flex:'1 1 30%'}}/> */}
    </div>
//     <Grid container spacing={1} height='98%'>
//   {/* create a row for each val in gridMap */}
//   {gridMap.map((cols, i) => (
//     <Grid container item xs={12} spacing={1} key={i} alignItems='center'>
//       {/* create a col for each val in gridMap */}
//       {[...Array(cols)].map((_, j) => (
//         <Grid item key={j} xs={12 / cols} overflow='hidden'>
//               {myVideo !== null && i === 0 && j === 0 ? (
//                 <video muted autoPlay playsInline ref={myVideo}/>
//               ) : (
//                 <>
//                   <Typography variant="h5" gutterBottom style={{ position: "absolute" }}>
//                     {`Loading ...`}
//                   </Typography>
//                   <Skeleton variant="rectangular" height="100px" width="100%" />
//                 </>
//               )}
//         </Grid>
//       ))}
//     </Grid>
//   ))}
// </Grid>

  );
};

export default VideoGrid;
