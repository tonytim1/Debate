import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  Button,
} from '@mui/material';

import Scrollbar from '../components/scrollbar';
import ROOM from '../_mock/room';

export default function ConversationRoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { id, roomName, topic, teams, hostUser, roomSize, users, messages, currentUser } = ROOM;

  const handleMessageInput = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput) {
      onMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <>
    <Helmet>
        <title> Debate Center | Debate </title>
    </Helmet>
    <Container>
      <Grid container alignItems="stretch" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center" gutterBottom>
            {roomName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <video autoPlay muted style={{ width: '100%', height: 'auto', margin: '0 auto' }}>
              <source src='/debate.mp4' type='video/mp4'/>
              <track kind="captions"/>
            </video>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5">Chat</Typography>
            <Scrollbar style={{ height: 400 }}>
              {messages.map((message, i) => {
                const user = message.author;

                return (
                  <div key={i}>
                    <Typography variant="subtitle1">
                      <strong>{user.name}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {message.text}
                    </Typography>
                  </div>
                );
              })}
            </Scrollbar>
            <Grid container alignItems="center" justifyContent="space-between" marginTop={2}>
              <Grid item xs={9}>
                <TextField label="Type a message" value={messageInput} onChange={handleMessageInput} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" onClick={handleSendMessage} fullWidth>
                  Send
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5">Spectators</Typography>
            <Scrollbar style={{ height: 473 }}>
              <ul>
                {users.map((user, i) => (
                  <li key={i}>
                    {user.name}
                  </li>
                ))}
              </ul>
            </Scrollbar>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}