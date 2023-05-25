import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton, 
  TableContainer,
  TablePagination,
  TextField,
  Autocomplete,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import ROOM from '../_mock/room'


export default function RoomPage() {
  const [messageInput, setMessageInput] = useState('');
  const { id, roomName, topic, teams, hostUser, roomSize, users, messages, currentUser } = ROOM

  const handleReady = () => {
    // onReady();
  };

  const handleStart = () => {
    // onStart();
  };

  const handleLeave = () => {
    // onLeave();
  };

  const handleMessageInput = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput) {
      // onMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleSwapTeam = (user) => {
    // onSwapTeam(user);
  };

  return (
    <>
    <Helmet>
      <title> Debate Center | Room Page </title>
    </Helmet>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h2">{roomName}</Typography>
            <Typography variant="h5">{`${topic} - ${teams ? "teams" : "free for all"}`}</Typography>
          </Grid>
          {/* users */}
          <Grid item xs={8}>
            <Typography variant="h6">Users ({users.length}/{roomSize})</Typography>
            <Paper variant="outlined">
              <List>
                {
                  Array.from({ length: roomSize }, (_, i) => {
                  const user = users[i];
                  const isRoomAdmin = user && user.id === hostUser.id
                  const isCurrentUser = user && user.id === currentUser.id

                  return (
                    <ListItem key={i} sx={{ backgroundColor: isCurrentUser ? '#E0EFFF' : undefined }}>
                      <ListItemAvatar>
                        {user? <Avatar alt={user.name} src={user.avatarUrl}/>:undefined}             
                      </ListItemAvatar>
                      <ListItemText primary={user ? user.name : 'Empty'} secondary={user ? (user.ready ? 'Ready' : 'Not ready') : ''} />
                      {isRoomAdmin && <ListItemText primary='Admin'/>}
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
          {/* buttons */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {currentUser.id !== hostUser.id && (<Grid item xs={4}>
                <Button variant="contained" onClick={handleReady} fullWidth>
                  Ready
                </Button>
              </Grid>
              )}
              {currentUser.id === hostUser.id && (<Grid item xs={4}>
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
      </Container>
    </>
  );
};

