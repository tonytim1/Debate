import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import { Typography, Grid, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button } from '@mui/material';

export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [roomData, setRoomData] = useState(null);
  const [usersData, setUsersData] = useState(new Map());
  const [currUserData, setCurrUserData] = useState(null);

  const curr_user_id = "manual_id"

  // Fetch room data from Firestore
  const fetchRoomData = async () => {
    console.log("in fetchRoomData")
    const roomRef = doc(firestore, 'rooms', roomId);
    try {
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        const room = roomSnapshot.data();
        setRoomData(room);
      } else {
        // Room not found, navigate to 404 page
        navigate('/404');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  // Function to fetch all users in the users collection for a room
  const fetchUsers = async () => {
    try {
      const usersRef = collection(firestore, 'rooms', roomId, 'users');
      const querySnapshot = await getDocs(usersRef);
  
      const usersMap = new Map();
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const { id, name, ready } = userData;
        usersMap.set(id, { name, ready });
      });
  
      setUsersData(usersMap);
    } catch (error) {
      console.error(error);
      return new Map();
    }

    console.log("now usersData is:", {usersData})
    setCurrUserData(usersData.get(curr_user_id))
  };

  useEffect(() => {
    fetchRoomData();
    fetchUsers();
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

  const handleReadyClick = async () => {
    try {
      // Get the current user's ID
      const userId = "manual_id"; // Replace with the actual user ID
      
      // Update the 'ready' field of the user in Firebase Firestore
      const userRef = doc(firestore, "rooms", roomId, "users", userId);
      await updateDoc(userRef, {
        ready: true
      });
      
      fetchUsers();

      console.log("User's ready status updated successfully.");
  
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartClick = async () => {
  }

  if (!roomData) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '24px',
          color: 'blue',
        }}
      >
        Loading...
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
              onClick={handleReadyClick}
            >
              Ready
            </Button>
      </Grid>
      <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleStartClick}
              disabled
            >
              Start
            </Button>
      </Grid>
    </>
  );
}
