import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Container, Stack, Box, Button, Card} from '@mui/material';
import { io } from 'socket.io-client';

const SpectatorsList = ({ moderatorId, currUserId}) => {
    return (
        <Card sx={{width: '20%'}}>
            Spectators
        </Card>
    );
};

export default SpectatorsList;