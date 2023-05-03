import { useState } from 'react';
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
} from '@mui/material';\
import ROOM from '../_mock/room'

export default function ConversationRoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { id, roomName, topic, teams, hostUser, roomSize, users, messages, currentUser } = ROOM

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
    <Container>
      <Grid>
        <Typography variant='h3' align='center'>What do you think on the reform?</Typography>
      </Grid>
      <Grid container alignItems="stretch" xs={12}>
        <Grid item xs={12} sx={{ width: '100%' }}>
          <video autoPlay muted style={{ width: '100%', height: 'auto', margin: '0 auto' }}>
            <source src='/debate.mp4' type='video/mp4'/>
            <track kind="captions"/>
          </video>
        </Grid>
        {/* chat */}
        <Card sx={{ p: 2 }}>
        <Grid padding={3} item xs={12} sx={{ backgroundColor: '#edf3fc' }}>
          <Typography variant="h5">Chat</Typography>
          <Grid container spacing={5}>
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
                  <TextField label="Type a message" value={messageInput} onChange={handleMessageInput} fullWidth />
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
        </Card>
      </Grid>
    </Container>
  );
}

