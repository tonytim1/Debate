import * as React from 'react';
import { Card, Stack, List, ListItem, ListItemText, Tooltip, ListSubheader, ListItemAvatar, Avatar,Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SpectatorsList = ({ isConversation, isSpectator, spectsList, allowSpectators, onIconClick }) => {
  if (!allowSpectators) {
    return null
  }

  return (
    <Card sx={{ width: '25%' }} style={{padding:'0px', overflow: 'auto', height:'100%'}}>
      <Stack style={{padding:'0px'}}>
        <List dense style={{padding:'0px', overflow:'auto'}}>
          <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center' }}>
          {isConversation ? null : (<Tooltip style={{alignSelf:'center'}} placement="top" arrow title="Be a spectator">
            <IconButton disabled={isSpectator} onClick={onIconClick} style={{position:'absolute', top:'4px', left:'4px'}}>
              <VisibilityIcon/>
            </IconButton>
          </Tooltip>)}
                Scpectators
          </ListSubheader>
          {Array.from( Object.keys(spectsList) ).map((userName, i) => (
                <ListItem key={i}
                secondaryAction={
                    <IconButton>
                        <MoreVertIcon sx={{fontSize: '15px'}}/>
                    </IconButton>
                }>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText id={i} primary={userName} />
                </ListItem>
              ))}
          </List>
      </Stack>
    </Card>
  );
};

export default SpectatorsList;
