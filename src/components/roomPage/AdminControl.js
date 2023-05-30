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

const AdminControl = ({ moderatorId, currUserId, roomId, socket}) => {

    const handle_start_click = () => {
        socket.emit('start_conversation_click', { 'roomId': roomId, 'userId':currUserId });  // currently currUserId is ignored by the server and the ip is used instead
      }

    return (
        currUserId === moderatorId ? (
            <Button variant="contained" type="submit" onClick={handle_start_click}>
                Start
            </Button>
        ) : (<></>)
    );

};

export default AdminControl;