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
import Chat from 'src/components/messages/Chat';
import useAuthentication from "../hooks/useAuthentication";
import SignupCard from 'src/components/Cards/SignupCard';
import LoginCard from 'src/components/Cards/LoginCard';
import LoadingScreen from 'src/components/Room/LoadingScreen';
import RoomFull from 'src/components/Room/RoomFull';
import RoomLobby from 'src/components/Room/RoomLobby';
import Conversation from 'src/components/Room/Conversation';

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
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  const isAuthenticated = useAuthentication();

  useEffect(() => {
    setShowLoginCard(!isAuthenticated);
  }, [isAuthenticated]);

  const socket = io('ws://' + window.location.hostname + ':8000');
  const currUserId = localStorage.getItem("userId")

  const join_room = () => {
    socket.emit('join_room', { roomId: roomId, userId: currUserId });
  
    socket.once('user_join', ( roomData ) => {
      setRoomData(roomData);
      setRoomState(1); // TODO: set state according to room data (lobby or conversation)
      if (roomData.is_conversation) {
        setRoomState(2);
      }
    });
    socket.once('room not found', () => {
      navigate('/404');
    });
    socket.once('room is full', () => {
      setRoomState(3);
    });
    socket.once('conversation_start', () => {
      console.log('conversation_start')
      // const conversationURL = `/conversation/${roomId}`;
      // navigate(conversationURL);
      setRoomState(2);
    });
    socket.on('receiveMessage', payload => {
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

  // loading screen
  if (roomState === 0) {
    return (
      <LoadingScreen />
    );
  }
  
  // room full screen
  if (roomState === 3){
    return (
      <RoomFull />
    );
  }

  // Room conversation screen
  if (roomState === 2){
    return (
      <Conversation roomData={roomData} currUserId={currUserId} roomId={roomId} socket={socket} messageRef={messageRef} setMessageRef={setMessageRef} messages={messages} setMessages={setMessages} />
    );
  }

  // Room lobby screen
  return (
    <>
      <Helmet>
        <title>Debate Center | Room Page</title>
      </Helmet>
      <RoomLobby roomData={roomData} currUserId={currUserId} roomId={roomId} socket={socket} messageRef={messageRef} setMessageRef={setMessageRef} messages={messages} setMessages={setMessages} />

    <LoginCard showLoginReminder={showLoginCard} onSignupClick={() => {setShowSignupCard(true); setShowLoginCard(false);}} />
    <SignupCard showCard={showSignupCard} onBackClick={() => {setShowSignupCard(false); setShowLoginCard(true); }} />
    </>
  );
}
