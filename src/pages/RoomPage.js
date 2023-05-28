import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Grid, Paper, List, Stack, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button } from '@mui/material';
import { io } from 'socket.io-client';


export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [roomData, setRoomData] = useState(null);
  const [usersData, setUsersData] = useState(new Map());
  const [currUserData, setCurrUserData] = useState(null);
  const [roomState, setRoomState] = useState(0) // 0 - loading, 1 - loby, 2 - conversation, 3 - full,

  const curr_user_id = "manual_id"

  const socket = io('http://10.0.0.20:5000');

  const join_room = async () => {
    try {
      const response = await fetch('http://10.0.0.20:5000/api/join_room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });
  
      if (response.ok) {
        const roomData = await response.json();
        if ('error' in roomData) {
          if (roomData.error === 'Room not found') {
            // Room not found, navigate to 404 page
            navigate('/404');
          } else if (roomData.error === 'Room is full') {
            // Room is full, handle accordingly
            setRoomState(3)
          }
        } else { // the room is ok
          setRoomState(1)
          return true
        }
      } else {
        console.error('Failed to fetch room data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (await join_room()) {
      socket.on('room_data_updated', (roomData) => {
        setRoomData(roomData);
      });
  
      return () => {
        socket.off('room_data_updated');
      };
    }
  }, []);
  
  const handleReady = () => {
    // Handle ready logic
  };

  const handleStart = () => {
    // Handle start logic
  };

  const handleLeave = () => {
    // Handle leave logic
  };

  const handleMessageInput = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    // Handle send message logic
  };

  const handleSwapTeam = (user) => {
    // Handle swap team logic
  };

  // const handleReadyClick = async () => {
  //   try {
  //     // Get the current user's ID
  //     const userId = "manual_id"; // Replace with the actual user ID
      
  //     // Update the 'ready' field of the user in Firebase Firestore
  //     const userRef = doc(firestore, "rooms", roomId, "users", userId);
  //     await updateDoc(userRef, {
  //       ready: true
  //     });
      
  //     fetchUsers();

  //     console.log("User's ready status updated successfully.");
  
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleStartClick = async () => {
  // }

  if (roomState === 0) {
    return (
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Adjust the height to fit your requirements
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
  }
  
  if (roomState === 3){
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
  }

  console.log(roomData);
  console.log(usersData);
  const { name, teams, hostUser, room_size, users, messages, currentUser } = roomData;

  return (
    <>
      <Helmet>
        <title>Debate Center | Room Page</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">{name}</Typography>
          <Typography variant="h5">{`${teams ? 'teams' : 'free for all'}`}</Typography>
        </Grid>
        {/* users */}
        <Grid item xs={8}>
          {/* <Typography variant="h6">Users ({users.length}/{room_size})</Typography> */}
          <Paper variant="outlined">
            <List>
              {/* {Array.from({ length: room_size }, (_, i) => {
                const user = users[i];
                const isRoomAdmin = user && user.id === hostUser.id;
                const isCurrentUser = user && user.id === currentUser.id;

                return (
                  <ListItem key={i} sx={{ backgroundColor: isCurrentUser ? '#E0EFFF' : undefined }}>
                    <ListItemAvatar>
                      {user ? <Avatar alt={user.name} src={user.avatarUrl} /> : undefined}
                    </ListItemAvatar>
                    <ListItemText primary={user ? user.name : 'Empty'} secondary={user ? (user.ready ? 'Ready' : 'Not ready') : ''} />
                    {isRoomAdmin && <ListItemText primary="Admin" />}
                  </ListItem>
                );
              })} */}

              {Array.from({ length: usersData.length }, (_, i) => {
                const user = usersData[i];
                return (
                  <ListItem key={i}>
                    {user.ready ? "ready" : ""} {user.name}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        {/* chat */}
        {/* <Grid item xs={8}>
          <Typography variant="h5">Chat</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ height: '200px', overflowY: 'auto' }}>
              {messages.map((message, i) => {
                const user = message.author;

                return (
                  <Grid item key={i}>
                    <Typography variant="body1">
                      <strong>{user.name}</strong>: {message.text}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={9}>
                  <TextField label="Type a message" onChange={handleMessageInput} fullWidth />
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" onClick={handleSendMessage} fullWidth>
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid> */}
        {/* buttons */}
        {/* <Grid item xs={12}>
          <Grid container spacing={2}>
            {currentUser.id !== hostUser.id && (
              <Grid item xs={4}>
                <Button variant="contained" onClick={handleReady} fullWidth>
                  Ready
                </Button>
              </Grid>
            )}
            {currentUser.id === hostUser.id && (
              <Grid item xs={4}>
                <Button variant="contained" onClick={handleStart} fullWidth disabled={users.length < room_size}>
                  Start
                </Button>
              </Grid>
            )}
            <Grid item xs={4}>
              <Button variant="contained" onClick={handleLeave} fullWidth>
                Leave
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
      <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              // onClick={handleReadyClick}
            >
              Ready
            </Button>
      </Grid>
      <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              // onClick={handleStartClick}
              disabled
            >
              Start
            </Button>
      </Grid>
    </>
  );
}
