import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Card, Stack } from '@mui/material';
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
                <Stack className={`container ${showDetails ? 'show-details' : ''}`}>
                    { <Confetti recycle={false} />} {/* Show confetti */}
                    <Box className={`success-message ${showDetails ? 'move-up' : ''}`} sx={{ marginTop: '-10px' }} >
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
                                🌟 Welcome to {localStorage.getItem('userId')}! 🌟
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
                    {showDetails && (
                        <Typography className="details-paragraph"
                        style={{ marginLeft: '30px', textAlign: 'left' }}>
                            🎉 Greetings and a Hearty Welcome! 🎉
                            <ul>
                                <li>
                                Dive into discussions that intrigue you by creating or joining rooms based on your interests.
                                </li>
                                <li>
                                Treat others as you would like to be treated. Do not engage in abusive, harassing, threatening, or intimidating behavior towards fellow users.
                                </li>
                                Delight in the world of thoughtful exchange during your stay.
                            </ul>
                        </Typography>
                    )}
                </Stack>
            </Card>
        </div>
    );
};

export default SuccessPage;
