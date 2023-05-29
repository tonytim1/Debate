import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Container, Stack, Box, Button} from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('ws://10.0.0.20:5000');

const UsersShow = ({ teams, usersList, roomId, currUserId}) => {
    const handle_switch = async () => {
        socket.emit('switch_team', { 
            'roomId': roomId, 
            'userId': currUserId,
        });
    };

    return (
    <Container>
      {teams ? (
        <Stack direction="row" spacing={2}>
            <Box>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Team 1
                    </ListSubheader>
                }>
                    {Object.entries(usersList).map(([userId, user]) => {
                        if (user.team) {
                            return (
                            <ListItem key={userId} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{user.ready ? 'Ready' : ''}  {userId}</>}
                                    secondary={null}
                                />
                            </ListItem>
                            );
                            }
                            return null;
                        })}
                    
                </List>
            </Box>
            <Button onClick={handle_switch}>
                change team
            </Button>
            <Box>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Team 2
                    </ListSubheader>
                }>
                    {Object.entries(usersList).map(([userId, user]) => {
                        if (!user.team) {
                            return (
                            <ListItem key={userId} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{user.ready ? 'Ready' : ''}  {userId}</>}
                                    secondary={null}
                                />
                            </ListItem>
                            );
                            }
                            return null;
                        })}
                    
                </List>
            </Box>
        </Stack>
      ) : (
        <List subheader={
            <ListSubheader component="div" id="nested-list-subheader">
            Team 1
            </ListSubheader>
        }>
            {Object.entries(usersList).map(([userId, user]) => {
                return (
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<>{user.ready ? 'Ready' : ''}  {userId}</>}
                            secondary={null}
                        />
                    </ListItem>
                    );
                }
            )}  
        </List>
      )}
    </Container>
  );
};

export default UsersShow;
