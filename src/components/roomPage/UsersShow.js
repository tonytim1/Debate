import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Container, Stack, Box, Button, Card} from '@mui/material';

const UsersShow = ({ teams, usersList, roomId, currUserId, socket, moderator}) => {
    const handle_switch = async () => {
        socket.current.emit('switch_team', { 
            'roomId': roomId, 
            'userId': currUserId,
        });
    };

    return (
    <Container
        style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            // height: '100%',
            
        }}>
    <Card
        style={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
        }}>
      {teams ? (
        <Stack direction="row" spacing={2} 
        style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Box sx={{width:'50%'}}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
                    Team 1
                    </ListSubheader>
                }
                >
                    {Object.entries(usersList).map(([userId, user]) => {
                        if (user.team) {
                            return (
                            <ListItem 
                                key={userId}
                                alignItems="flex-start"
                                sx={{
                                    backgroundColor: user.ready ? '#D1FFBD' : 'inherit',
                                  }}
                            >
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{userId} <a style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</a></>}
                                    secondary={moderator === userId ? "Moderator" : "" }
                                />
                            </ListItem>
                            );
                            }
                            return null;
                        })}
                    
                </List>
            </Box>
            <Button onClick={handle_switch} sx={{width:'0%'}}>
                change team
            </Button>
            <Box sx={{width:'50%'}}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
                    Team 2
                    </ListSubheader>
                }>
                    {Object.entries(usersList).map(([userId, user]) => {
                        if (!user.team) {
                            return (
                            <ListItem 
                                key={userId} 
                                alignItems="flex-start"
                                sx={{
                                    backgroundColor: user.ready ? '#D1FFBD' : 'inherit',
                                  }}
                            >
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{userId} <a style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</a></>}
                                    secondary={moderator === userId ? "Moderator" : ""}
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
            <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
                Users
            </ListSubheader>
        }>
            {Object.entries(usersList).map(([userId, user]) => {
                return (
                    <ListItem alignItems="flex-start" 
                        key={userId}
                        sx={{
                            backgroundColor: user.ready ? '#D1FFBD' : 'inherit',
                        }}>
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src='/assets/images/avatars/avatar_default.jpg' />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<>{userId} <a style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</a></>}
                            secondary={moderator === userId ? "Moderator" : ""}
                        />
                    </ListItem>
                    );
                }
            )}  
        </List>
      )}
    </Card>
    </Container>
  );
};

export default UsersShow;
