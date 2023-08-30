import React, { useState } from 'react';
import Scrollbar from '../scrollbar';
import { Card, Grid, TextField, Typography, Button, Stack } from '@mui/material';

const Chat = ({ roomId, socket, messageRef, setMessageRef, messages, setMessages, currUserId }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('sendButton').click();
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    // check if message is empty:
    if (messageRef === '') {
      return;
    }
    socket.current.emit('sendMessage', {
      roomId: roomId,
      message: messageRef,
      userId: currUserId,
    });
    setMessageRef('');
  };

  return (
    <Card sx={{ p: 2, width: '95%' }} style={{height: '100%', flexGrow: '1'}}>
      <Stack style={{height: '100%'}}>
        <Typography variant="h5" style={{marginBottom: '10px'}}>Chat</Typography>
        <Scrollbar style={{}}>
          {messages.map((message, i) => {
            const user = message.userId;
            const isBot = message.bot;
            return (
              <div key={i}>
                {
                  isBot ? (
                    <Typography color='green'>
                      <strong>Bot: </strong>
                      {message.message}
                    </Typography>
                  ) : (
                  <Typography>
                    <strong>{user}: </strong>
                    {message.message}
                  </Typography>
                  )
                }
                {/* <Typography variant="body1" gutterBottom>
                  
                </Typography> */}
              </div>
            );
          })}
        </Scrollbar>
        {/* Send message container */}
        <Stack style={{marginTop:"10px"}} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Type a message"
            value={messageRef}
            onChange={(e) => setMessageRef(e.target.value)}
            fullWidth
            onKeyDown={handleKeyDown}
          />
          <Button variant="outlined" onClick={sendMessage} size="large" id="sendButton">
            Send
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default Chat;
