import { Box, Typography, Card } from '@mui/material';
import './RoomExplaination.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const RoomExplaination = ({ showCard, onCloseClick }) => {
    if (!showCard) {
        return null;
    }

    return (
        <div className="base-card">
            <div className="overlay-background" />
            <Card className='welcome-card' sx={{
                position: 'relative',
                minHeight: 'fit-content',
                width: '80%',
                maxWidth: '500px',
                maxHeight: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <IconButton
                    sx={{ position: 'absolute', left: 15, top: 15, zIndex: 1 }} // Adjusted zIndex
                    onClick={() => {
                        onCloseClick();
                }}>
                    <CloseIcon />
                </IconButton>
                <Box style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                 }}>
                    <Typography style={{ marginLeft: '30px', textAlign: 'left' }}>
                        <b>🎉 First Time in a Room!! 🎉</b><br></br>
                            Here are some tips to help you get started:<br></br><br></br>
                            <ul>
                            <li>
                                The "Moderator" will start the conversation when all users are ready.
                            </li>
                            <li>
                                Press "Ready" to inform the "Moderator" you are ready.
                            </li>
                            <li>
                                Use the chat to communicate with other users.
                            </li>
                            <li>
                                Use ⋮ to report a user if nessesary.
                            </li>
                        </ul>
                    </Typography>
                </Box>
            </Card>
        </div>
    );
};

export default RoomExplaination;
