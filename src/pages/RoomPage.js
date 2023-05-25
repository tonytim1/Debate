import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import firestore from '../firebase';
import { Typography, Grid, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button } from '@mui/material';

export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { roomId } = useParams();
  const history = useHistory();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // Fetch room data from Firestore
    const fetchRoomData = async () => {
      const roomRef = doc(firestore, 'rooms', roomId);

      try {
        const roomSnapshot = await getDoc(roomRef);
        if (roomSnapshot.exists()) {
          const room = roomSnapshot.data();
          setRoomData(room);
        } else {
          // Room not found, redirect to 404 page
          history.push('/404');
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [roomId, history]);

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

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const { roomName, topic, teams, hostUser, roomSize, users, messages, currentUser } = roomData;

  return (
    <>
      <Helmet>
        <title>Debate Center | Room Page</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">{roomName}</Typography>
          <Typography variant="h5">{`${topic} - ${teams ? 'teams' : 'free for all'}`}</Typography>
        </Grid>
        {/* users */}
        <Grid item xs={8}>
          <Typography variant="h6">Users ({users.length}/{roomSize})</Typography>
          <Paper variant="outlined">
            <List>
              {Array.from({ length: roomSize }, (_, i) => {
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
              })}
            </List>
          </Paper>
        </Grid>
        {/* chat */}
        <Grid item xs={8}>
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
        </Grid>
        {/* buttons */}
        <Grid item xs={12}>
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
                <Button variant="contained" onClick={handleStart} fullWidth disabled={users.length < roomSize}>
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
        </Grid>
      </Grid>
    </>
  );
}
