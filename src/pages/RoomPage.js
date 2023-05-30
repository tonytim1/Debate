import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Await, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import UsersShow from 'src/components/roomPage/UsersShow';
import AdminControl from 'src/components/roomPage/AdminControl';
import { Typography, Grid, Card,Paper, List, Stack, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Container } from '@mui/material';
import { io } from 'socket.io-client';


export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [roomData, setRoomData] = useState(new Map());
  const [usersData, setUsersData] = useState(new Map());
  const [currUserData, setCurrUserData] = useState(null);
  const [isModerator, setIsModerator] = useState(false);
  const [roomState, setRoomState] = useState(0); // 0 - loading, 1 - loby, 2 - conversation, 3 - full,

  const socket = io('ws://' + window.location.hostname + ':5000');
  // const currUserId = '127.0.0.1'
  const currUserId = 'moderator'  // change to real user id

  const join_room = () => {
    socket.emit('join_room', { roomId });
  
    socket.once('join', (roomData) => {
      setRoomData(roomData);
      setRoomState(1);
    });
    socket.once('room not found', () => {
      navigate('/404');
    });
    socket.once('room is full', () => {
      setRoomState(3);
    });
    socket.once('in conversation', () => {
      const conversationURL = `/conversation/${roomId}`;
      navigate(conversationURL);
    });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      join_room();
      socket.on('room_data_updated', (roomData) => {
        setRoomData(roomData);
      });

      return () => {
        socket.off('room_data_updated');
      };
    };
  
    fetchData();
  }, []);

  const handle_ready_click = () => {
    socket.emit('ready_click', { 'roomId': roomId, 'userId':currUserId });  // currently currUserId is ignored by the server and the ip is used instead
  }


  // loading screen
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
  
  // room full screen
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
  console.log(Object.keys(roomData.users_list).length)
  const { name, teams, room_size, users_list, moderator} = roomData;


  return (
    <>
      <Helmet>
        <title>Debate Center | Room Page</title>
      </Helmet>
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Stack direction="column" alignItems="center" spacing={3}>
          <Typography variant="h2">{name}</Typography>
          <UsersShow teams={teams} usersList={users_list} currUserId={currUserId} roomId={roomId} />
          <Card>
            chat
          </Card>
          <Button type="submit" variant="contained" onClick={handle_ready_click}>
            Ready
          </Button>
          <AdminControl moderatorId={moderator} currUserId={currUserId}/>
        </Stack>
      </Container>
      <Grid container spacing={3}>
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
    </>
  );
}
