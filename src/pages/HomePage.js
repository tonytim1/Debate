import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Grid, Button, Box, Skeleton, Paper, Container, Grow, TextField, Stack, Typography, Autocomplete } from '@mui/material';
import Iconify from '../components/iconify';
import BlogPostCard from '../sections/@dashboard/blog/BlogPostCard';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/system';
import useAuthentication from "../hooks/useAuthentication";
import './HomePage.css'
import CreateRoomCard from 'src/components/Cards/CreateRoomCard';
import SignupCard from 'src/components/Cards/SignupCard';
import LoginCard from 'src/components/Cards/LoginCard';
import RoomCard from 'src/components/homepage/RoomCard';
// ----------------------------------------------------------------------


const CardContainer = styled('div')({
  width: '100%',
  // overflowY: 'scroll',
  // scrollbarWidth: 'thin',
  // scrollbarColor: 'transparent transparent',
  padding: '0px', // Adjust the padding value as needed
  // boxSizing: 'border-box',
  
});

// ----------------------------------------------------------------------

export default function HomePage() {
  const colors = [
    '#263238', // Dark Blue Grey
    '#9C27B0', // Deep Purple
    '#6A1B9A', // Dark Purple
    '#303F9F', // Indigo
    '#1A237E', // Midnight Blue
    '#004D40', // Dark Teal
    '#006064', // Dark Cyan
    '#01579B', // Dark Blue
    '#FF6F00', // Dark Orange
    '#E65100', // Dark Amber
  ];
  const getRandomColor = () => alpha(colors[random(0, colors.length - 1)], 0.72);  

  const [roomsData, setRoomsData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(false);
  const [showCreateRoomCard, setShowCreateRoomCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = useAuthentication();

  const socket = io('ws://' + window.location.hostname + ':8000');

  const fetchRooms = async () => {
    socket.emit('fetch_all_rooms');
  };

  // useEffect(() => {
  //   if(!isAuthenticated) {
  //     navigate('/dashboard/login');
  //   }
  // }, [isAuthenticated]);

  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      setShowCreateRoomCard(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      fetchRooms();
      socket.on('all_rooms', (rooms) => {
        const mappedRooms = new Map(Object.entries(rooms));
        mappedRooms.forEach((data) => {
          data.color = getRandomColor(); // Add random color to each room
        });
        setRoomsData(mappedRooms);
      });
      socket.on('rooms_updated', () => {
        console.log('rooms updated');
        fetchRooms();
        // set roomsData to new data
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    fetchData();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log(roomsData);
    filterRooms('');
  }, [roomsData]);

  useEffect(() => {
    setShowLoginCard(!isAuthenticated);
  }, [isAuthenticated]);

  const filterRooms = (query) => {
    const filtered = Array.from(roomsData).filter(([roomId, data]) => {
      const tags = data.tags || [];
      const name = data.name || '';
      const lowerQuery = query.toLowerCase();
      return tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) || name.toLowerCase().includes(lowerQuery);
    });
    setFilteredRooms(filtered);
  };



  return (
    <>
      <Helmet>
        <title> Debate Center | Home </title>
      </Helmet>
      <Container>
          <Stack spacing={2} alignItems="center" justifyContent="center"  mb={1}>
            <Typography variant="h2">
              Debate Center
            </Typography>
            <Typography variant="h8">
              Discover diverse perspectives, ignite meaningful discussions
            </Typography>
            <Stack spacing={2} mb={3} direction="row" alignItems="center" justifyContent="center" sx={{width:'100%'}}>
              <TextField
                label="Search for debates"
                sx={{ width: '90%' }}
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  filterRooms(query);
                }}
                />
              {/* <Button size="small" variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {navigate("/dashboard/createRoom")}}> */}
              <Button size="small" variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} 
                onClick={() => {
                  setShowCreateRoomCard(true);}}>
                Create Room
              </Button>
              
            </Stack>
            {roomsData ? (
              <CardContainer>
                <Grid container justifyContent="center">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map(([roomId, data], index) => (
                      <RoomCard
                        key={`${roomId}-${searchQuery}`}
                        room={data}
                        roomId={roomId}
                        color={data.color}
                        timeout={(index + 1) * 250}
                        pictureId={data.pictureId}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ fontSize: '1rem', color: 'gray', marginTop: '100px' }}>
                      There are no rooms, maybe you should make one?
                    </Typography>
                  
                  )}
                </Grid>
              </CardContainer>
            ) : (
              <Stack spacing={4}>
                <Stack direction="row" spacing={4}>
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                </Stack>
                <Stack direction="row" spacing={4}>
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                </Stack>
              </Stack>
            )}
          </Stack>
      </Container> 
      <LoginCard showLoginReminder={showLoginCard} onSignupClick={() => {setShowSignupCard(true); setShowLoginCard(false);}} />
      <SignupCard showCard={showSignupCard} onBackClick={() => {setShowSignupCard(false); setShowLoginCard(true); }} />
      <CreateRoomCard showCard={showCreateRoomCard} onCloseClick={() => setShowCreateRoomCard(false)} />
    </>
  );
}
