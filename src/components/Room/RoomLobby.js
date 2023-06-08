import React from 'react'
import UsersShow from 'src/components/roomPage/UsersShow';
import AdminControl from 'src/components/roomPage/AdminControl';
import SpectatorsList from 'src/components/roomPage/SpectatorsList';
import { Typography, Stack, Button, Container } from '@mui/material';
import Chat from 'src/components/messages/Chat';
import { useNavigate } from 'react-router-dom';


const RoomLobby = ({ roomData, currUserId, roomId, socket, messageRef, setMessageRef, messages, setMessages }) => {
  const { name, teams, users_list, moderator } = roomData;
  const navigate = useNavigate();
  const handle_ready_click = () => {
    socket.emit('ready_click', { 'roomId': roomId, 'userId':currUserId });  // currently currUserId is ignored by the server and the ip is used instead
  }

  const handle_leave_click = () => {
    socket.emit('leave_click', { 'roomId': roomId, 'userId':currUserId });  // currently currUserId is ignored by the server and the ip is used instead
    navigate('/');
  } 

  return (
    <>
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
};

export default RoomLobby