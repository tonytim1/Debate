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

const AdminControl = ({ moderatorId, currUserId}) => {

    return (
        currUserId === moderatorId ? (
            <Button>
                Start
            </Button>
        ) : (<></>)
    );

};

export default AdminControl;