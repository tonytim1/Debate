import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Await, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import UsersShow from 'src/components/roomPage/UsersShow';
import AdminControl from 'src/components/roomPage/AdminControl';
import SpectatorsList from 'src/components/roomPage/SpectatorsList';
import { Typography, Grid, Card,Paper, List, Stack, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Container } from '@mui/material';
import { io } from 'socket.io-client';
import ConversationRoomPage from './ConversationRoomPage';
import Chat from 'src/components/messages/Chat';
import useAuthentication from "../hooks/useAuthentication";


export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [roomData, setRoomData] = useState(new Map());
  const [usersData, setUsersData] = useState(new Map());
  const [currUserData, setCurrUserData] = useState(null);
  const [isModerator, setIsModerator] = useState(false);
  const [roomState, setRoomState] = useState(0); // 0 - loading, 1 - loby, 2 - conversation, 3 - full,
  const [ messageRef, setMessageRef ] = useState(''); 
  const [ messages, setMessages ] = useState([]);

  const isAuthenticated = useAuthentication();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/dashboard/login');
    }
  }, [isAuthenticated]);

  const socket = io('ws://' + window.location.hostname + ':5000');
  //const currUserId = 'moderator'  // change to real user id
  const currUserId = localStorage.getItem("userId")

  const join_room = () => {
    socket.emit('join_room', { roomId: roomId, userId: currUserId });
  
    socket.once('user_join', ( roomData ) => {
      setRoomData(roomData);
      setRoomState(1);
    });
    socket.once('room not found', () => {
      navigate('/404');
    });
    socket.once('room is full', () => {
      setRoomState(3);
    });
    socket.once('conversation_start', () => {
      console.log('conversation_start')
      const conversationURL = `/conversation/${roomId}`;
      navigate(conversationURL);
    });
    socket.on('receiveMessage', payload => {
      console.log("recieved message");
      setMessages(messages => [...messages, payload]);
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

  const handle_leave_click = () => {
    socket.emit('leave_click', { 'roomId': roomId, 'userId':currUserId });  // currently currUserId is ignored by the server and the ip is used instead
    navigate('/');
  }

  // loading screen
  if (roomState === 0) {
    return (
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
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

  const { name, teams, room_size, users_list, moderator} = roomData;
  console.log(users_list);

  return (
    <>
      <Helmet>
        <title>Debate Center | Room Page</title>
      </Helmet>
      <Container style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '60vh',
      }}>
        <Stack direction="column" alignItems="center" spacing={3} sx={{ width: '100%' }}>
          <Typography variant="h2">{name}</Typography>
        <Stack direction="row" sx={{ width: '100%' }}>
          <UsersShow teams={teams} usersList={users_list} currUserId={currUserId} roomId={roomId} socket={socket} moderator={moderator} />
          <SpectatorsList/>
        </Stack>
        <Chat roomId={roomId} socket={socket} messageRef={messageRef} setMessageRef={setMessageRef} messages={messages} setMessages={setMessages} currUserId={currUserId}/>
        <Stack direction="row" spacing={8}>
          <Button variant="contained" onClick={handle_leave_click} color="error">
            Leave
          </Button>
          <Button type="submit" variant="contained" onClick={handle_ready_click} color="success">
            Ready
          </Button>
          <AdminControl moderatorId={moderator} currUserId={currUserId} roomId={roomId} socket={socket}/>
        </Stack>
        </Stack>
      </Container>
      
      
        
    </>
  );
}
