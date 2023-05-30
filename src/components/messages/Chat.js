import React, {useState} from 'react'
import Scrollbar from '../scrollbar';
import {
  Card,
  Grid,
  TextField,
  Typography,
  Button,
} from '@mui/material';

const Chat = ({ roomId, socket }) => {
    const [ messageRef, setMessageRef ] = useState(''); //message input
    const [ messages, setMessages ] = useState([]); //all messages state after joining the room

    //receiving message of an user and adding this at message state
    socket.on('receiveMessage', payload => {
        console.log("recieved message");
        setMessages(messages => [...messages, payload]);
    });

    const sendMessage = (e) => {
        e.preventDefault();
        //sending message text with roomId to sever it will send message along other data to all connected user of current room
        socket.emit('sendMessage', {
            roomId: roomId,
            message: messageRef,
        })
        setMessageRef("");
    }

  return (
    <Grid item xs={12} md={6}>
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Chat</Typography>
      <Scrollbar style={{ height: 200 }}>
      {messages.map((message, i) => {
        const user = message.userId;
        return (
        <div key={i}>
          <Typography variant="subtitle1">
          <strong>{user}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
          {message.message}
          </Typography>
        </div>
        );
      })}
      </Scrollbar>
      {/*Send message container*/}
      <Grid container alignItems="center" justifyContent="space-between" marginTop={2}>
      <Grid item xs={9}>
        <TextField label="Type a message" value={messageRef} onChange={(e) => setMessageRef(e.target.value)} fullWidth />
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" onClick={sendMessage} fullWidth>
        Send
        </Button>
      </Grid>
      </Grid>
    </Card>
    </Grid>
  );
};

export default Chat