import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Card } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Confetti from 'react-confetti';
import './FirstTimeUser.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SuccessPage = ({ showCard, onCloseClick }) => {
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (showCard) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1500);

            const detailsTimer = setTimeout(() => {
                setShowDetails(true);
            }, 2000);

            return () => {
                clearTimeout(timer);
                clearTimeout(detailsTimer);
            };
        }
    }, [showCard]);

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
                        window.location.reload();
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box className={`container ${showDetails ? 'show-details' : ''}`}>
                    { <Confetti recycle={false} />} {/* Show confetti */}
                    <Box className={`success-message ${showDetails ? 'move-up' : ''}`}>
                        <Box>
                            {loading ? (
                                <>
                                    <CircularProgress
                                        color="success"
                                        size={100}
                                        sx={{ color: '#388e3c' }} // Make CircularProgress green
                                    />
                                    <Typography variant="h5" sx={{ marginTop: 2 }}>
                                        Creating your debate account...
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                        Welcome, {localStorage.getItem('userId')}!
                                    </Typography>
                                    <CheckCircleIcon
                                        color="success"
                                        sx={{ fontSize: 100, color: '#388e3c' }}
                                    />
                                    <Typography variant="h4" sx={{ marginTop: 2 }}>
                                        Successfully Connected!
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                    {showDetails && (
                        <Typography className="details-paragraph"
                        style={{ marginLeft: '30px', textAlign: 'left' }}>
                            Welcome to our website!
                            Here are some rules about our services:
                            <ul>
                                <li>
                                    You can report users by clicking on their name in the room
                                </li>
                                <li>
                                    You must not abuse, harass, threaten, impersonate or intimidate
                                    other users of our services.
                                </li>
                            </ul>
                        </Typography>
                    )}
                </Box>
            </Card>
        </div>
    );
};

export default SuccessPage;
