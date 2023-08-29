import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Container, Stack, Box, Tooltip, Button, Card, IconButton} from '@mui/material';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import ReportMenu from '../Room/ReportMenu';
import { LocalParking } from '@mui/icons-material';

const UsersShow = ({ onSpecClick, allowSpectators, teamNames, teams, usersList, roomId, currUserId, socket, moderator, isSpectator, roomSize, user_reports}) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();
    const userTeam = usersList[currUserId].team;
    
    const handle_switch = async () => {
        setIsDisabled(true);
        socket.current.emit('switch_team', { 
            'roomId': roomId, 
            'userId': currUserId,
        });
        setTimeout(() => {
            setIsDisabled(false);
        }, 3000);
    };

    socket.current.once('check_report_user_list', data => {
            if(currUserId === data.reportedUserId){
                socket.current.emit('kick_user', { 'roomId': roomId, 'userId':currUserId });
                console.log('you got kicked out of the room');
                navigate('/');
            }           
    });

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
            {allowSpectators ? (
            <Tooltip style={{alignSelf:'center'}} placement="top" arrow title="Be a Debator">
            <IconButton disabled={!isSpectator || Object.keys(usersList).length >= roomSize} onClick={onSpecClick} style={{right: '4px', top: '4px', position: 'absolute', zIndex: '3'}}>
                <PersonAddIcon/>
            </IconButton>
            </Tooltip>
            ) : null}
      {teams ? (
        <Stack direction="row" spacing={2} 
        style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
          }}>
            <Box sx={{width:'50%'}}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
                    {teamNames[0]} {Object.values(usersList).reduce((acc, user) => user.team === true ? acc + 1 : acc, 0)} / {Math.ceil(roomSize / 2)}
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
                                    <Avatar src={user.photo_url} alt="photoURL" referrerPolicy="no-referrer" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{userId} <span style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</span></>}
                                    secondary={moderator === userId ? "Moderator" : "" }
                                />
                                {userId !== currUserId ? 
                                    <ReportMenu userId={userId} currUserId={currUserId} roomId={roomId} socket={socket}/>
                                    : null
                                }
                            </ListItem>
                            );
                            }
                            return null;
                        })}
                    
                </List>
            </Box>
            <Button style={{backgroundColor: '#e6ebf9ab', margin: '0px'}} 
            disabled={isDisabled || Object.values(usersList).reduce((acc, user) => user.team !== userTeam ? acc + 1 : acc, 0) >= Math.ceil(roomSize / 2)} 
            onClick={handle_switch} sx={{width:'0%'}}>
                change team
            </Button>
            <Box sx={{width:'50%'}} style={{margin: '0px'}}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
                    {teamNames[1]} {Object.values(usersList)((acc, user) => user.team === false ? acc + 1 : acc, 0)} / {Math.ceil(roomSize / 2)}
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
                                    <Avatar src={user.photo_url} alt="photoURL" referrerPolicy="no-referrer" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{userId} <span style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</span></>}
                                    secondary={moderator === userId ? "Moderator" : ""}
                                />
                                {userId !== currUserId ? 
                                    <ReportMenu userId={userId} currUserId={currUserId} roomId={roomId} socket={socket}/>
                                    : null
                                }
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
                Users {Object.keys(usersList).length} / {roomSize}
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
                            <Avatar src={user.photo_url} alt="photoURL" referrerPolicy="no-referrer" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<>{userId} <span style={{ color: 'black', fontWeight: 'bold' }}>{user.ready ? 'Ready' : ''}</span></>}
                            secondary={moderator === userId ? "Moderator" : ""}
                        />
                        {userId !== currUserId ? 
                            <ReportMenu userId={userId} currUserId={currUserId} roomId={roomId} socket={socket}/>
                            :null
                        }
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
