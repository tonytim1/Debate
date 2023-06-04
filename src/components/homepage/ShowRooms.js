import { Grid, Button,Box,Paper, Container, Grow, TextField, Stack, Typography, Autocomplete } from '@mui/material';
import { alpha, styled } from '@mui/system';
import { BlogPostCard } from 'src/sections/@dashboard/blog';
import { useState } from 'react';
import React from 'react'
import RoomCard from './RoomCard';


const CardContainer = styled('div')({
    width: '100%',
    height: 'calc(80vh)', // Adjust the height value based on your header or other components
    overflowY: 'scroll',
    scrollbarWidth: 'thin',
    scrollbarColor: 'transparent transparent',
    padding: '24px', // Adjust the padding value as needed
    boxSizing: 'border-box',
    
  });

export default function ShowRooms({filteredRooms, searchQuery}) {
    return (
        <>
        { filteredRooms ? (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Box sx={{
            filter: 'blur(5px)', // Apply the blur effect
            width: '100%', 
            height: '10%',
            aspectRatio: '10/1', // Set aspect ratio for volume
            }}>
            </Box>
            <CardContainer sx={{ overflow: 'auto'}}>
                <Grid container spacing={3} justifyContent="center">
                {filteredRooms.map(([roomId, data], index) => (
                    <RoomCard
                    key={`${roomId}-${searchQuery}`} // Add unique key that includes searchQuery
                    room={data}
                    roomId={roomId}
                    color={data.color}
                    timeout={(index + 1) * 250} // Calculate timeout based on index
                    />
                ))}
                </Grid>
            </CardContainer>
        </Stack>
        )
        :
        (
            <div>hello</div>
        )
    }
    </>
    )
}
