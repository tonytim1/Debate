import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Card } from '@mui/material';
import './RoomExplaination.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const RoomExplaination = ({ showCard, onCloseClick }) => {
    if (!showCard) {
        return null;
    }

    return (
        <div>
            <div/>
            <Card sx={{
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
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box>
                    <Typography style={{ marginLeft: '30px', textAlign: 'left' }}>
                            🎉 First Time in a Room! 🎉
                            <br></br>
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
                </Box>
            </Card>
        </div>
    );
};

export default RoomExplaination;
