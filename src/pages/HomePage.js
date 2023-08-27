import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Grid, Button, Skeleton, Container, TextField, Stack, Typography, ToggleButtonGroup, ToggleButton,Snackbar, Alert, AlertTitle } from '@mui/material';
import Iconify from '../components/iconify';
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { random } from 'lodash';
import { alpha, styled } from '@mui/system';
import useAuthentication from "../hooks/useAuthentication";
import './HomePage.css'
import CreateRoomCard from 'src/components/Cards/CreateRoomCard';
import SignupCard from 'src/components/Cards/SignupCard';
import LoginCard from 'src/components/Cards/LoginCard';
import RoomCard from 'src/components/homepage/RoomCard';
import LoginStageCard from 'src/components/Cards/LoginStageCard';
import SuccessPage from 'src/components/Cards/FirstTimeUser';

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

  const [roomsData, setRoomsData] = useState(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [showCreateRoomCard, setShowCreateRoomCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showLoginStageCard, setShowLoginStageCard] = useState(false);
  const [showSuccessPageCard, setShowSuccessPageCard] = useState(false);
  const [sortType, setSortType] = useState('recommended'); // ['soon', 'recommended', 'popular']
  const socket = useRef();
  const username = localStorage.getItem("userId");
  const tags = localStorage.getItem("tags");
  const isAuthenticated = useAuthentication();
  const [staging, setStaging] = useState(false);
  const [loginAlert, setLoginAlert] = useState(true);

  const handelClose = (event, reason) => {
    setLoginAlert(false);
    sessionStorage.removeItem('loggedIn');
  };

  useEffect(() => {
    socket.current = io('ws://' + window.location.hostname + ':8000')
  }, []);

  const fetchRooms = async () => {
    socket.current.emit('fetch_all_rooms');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      setShowCreateRoomCard(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchRooms();
      socket.current.on('all_rooms', (rooms) => {
        const mappedRooms = new Map(Object.entries(rooms));
        mappedRooms.forEach((data) => {
          data.color = getRandomColor(); // Add random color to each room
        });
        setRoomsData(mappedRooms);
      });
    };

    // TODO: dont fetch all rooms again
    socket.current.on('rooms_updated', (room) => {
      fetchRooms();
      // console.log('rooms updated');
      // const rooms = roomsData;
      // rooms.set(room.id, room);
      // setRoomsData(rooms);
    });
    socket.current.on('rooms_new', (room) => {
      fetchRooms();
      // console.log('rooms new');
      // const rooms = roomsData;
      // rooms.set(room.id, room);
      // setRoomsData(rooms);
    });
    socket.current.on('rooms_deleted', (room) => {
      fetchRooms();
      // const rooms = roomsData;
      // rooms.delete(room.id);
      // setRoomsData(rooms);
      // console.log("delete 2", roomsData);
    });

    window.addEventListener('keydown', handleKeyPress);
    fetchData();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  },[]);

  const filterRooms = (query) => {
    const filtered = Array.from(sortedRooms).filter(([roomId, data]) => {
      const tags = data.tags || [];
      const name = data.name || '';
      const lowerQuery = query.toLowerCase();
      
      // Filter out rooms where is_conversation is true and spectators is false
      if (data.is_conversation && !data.spectators) {
        return false;
      }
      
      // Filter out rooms that are full
      if (data.room_size <= data.users_list.length) {
        return false;
      }
      
      return (
        (tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
         name.toLowerCase().includes(lowerQuery))
      );
    });
    setFilteredRooms(filtered);
  };


  const sortRooms = () => {
    if (sortType === 'soon') {
      return Array.from(roomsData).sort((a, b) => {
        return a[1].time_to_start - b[1].time_to_start;
      });
    }
    if (sortType === 'recommended') {
      return Array.from(roomsData).sort((a, b) => {
        const count_a = countCommonValues(a[1].tags, tags ?? []);
        const count_b = countCommonValues(b[1].tags, tags ?? []);
        return count_b - count_a;
      });
    }
    if (sortType === 'popular') {      
      return Array.from(roomsData).sort((a, b) => {
        
        return Object.keys(b[1].users_list).length - Object.keys(a[1].users_list).length || Object.keys(b[1].spectators_list).length - Object.keys(a[1].spectators_list).length;
      });
    }
    return Array.from(roomsData);
  };


  useEffect(() => {
    filterRooms('');
  }, [sortedRooms]);

  useEffect(() => {
    setSortedRooms(sortRooms(roomsData));
  }, [sortType, roomsData]);

  useEffect(() => {
    if ( localStorage.getItem('UserAuthenticated') === 'true' || staging === true )  setShowLoginCard(false);
    else setShowLoginCard(true) });
  //   setShowLoginCard(!isAuthenticated);
  // }, [isAuthenticated]);


  function countCommonValues(array1, array2) {
    let count = 0
    for (let i = 0; i < array1.length; i++) {
      if (array2.includes(array1[i])) {
        count += 1;
      }
    }
    return count;
  }

  return (
    <>
      <Helmet>
        <title> Debate Center | Home </title>
      </Helmet>
      <Container>
        <Stack spacing={2} alignItems="center" justifyContent="center" mb={1}>
        <Snackbar open={isAuthenticated && loginAlert && sessionStorage.getItem('loggedIn') === 'true'} autoHideDuration={6000} onClose={handelClose}
        anchorOrigin={{
          vertical: 'top',  // Set the vertical position of the Snackbar (top, bottom)
          horizontal: 'center'  // Set the horizontal position of the Snackbar (left, center, right)
        }}>
          <Alert severity="success" onClose={handelClose}>
            <AlertTitle>Login successful!</AlertTitle>
          </Alert>
          </Snackbar>
          <Typography variant="h2">
            Debate Center
          </Typography>
          <Typography variant="h8">
            Discover diverse perspectives, ignite meaningful discussions
          </Typography>
          <Stack spacing={2} mb={3} direction="row" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
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
                setShowCreateRoomCard(true);
              }}>
              Create Room
            </Button>
          </Stack>
          <ToggleButtonGroup
            value={sortType}
            exclusive
            onChange={(event, val) => { setSortType(val); }}
            color="primary"
          >
            <ToggleButton value="recommended" sx={{ color: 'text.secondary' }}>
              Recommended
            </ToggleButton>
            <ToggleButton value="popular" sx={{ color: 'text.secondary' }}>
              Popular
            </ToggleButton>
            <ToggleButton value="soon" sx={{ color: 'text.secondary' }}>
              Starting Soon
            </ToggleButton>
          </ToggleButtonGroup>
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
      <LoginCard showLoginReminder={showLoginCard} onSignupClick={() => { setShowSignupCard(true); setStaging(true); }} 
      onLoginStageClick={() => { setShowLoginStageCard(true); setStaging(true);}} />
      <LoginStageCard showCard={showLoginStageCard} onBackClick={() => { setShowLoginStageCard(false); setStaging(false); }} 
      onFirstTimeUser = {() => {setShowSuccessPageCard(true); setShowLoginStageCard(false);}} />
      <SignupCard showCard={showSignupCard} onBackClick={() => { setShowSignupCard(false); setStaging(false); }} 
      onFirstTimeUser = {() => {setShowSuccessPageCard(true); setShowSignupCard(false);}} />
      <SuccessPage showCard={showSuccessPageCard} onCloseClick={() => setShowSuccessPageCard(false)} />
      <CreateRoomCard showCard={showCreateRoomCard} onCloseClick={() => setShowCreateRoomCard(false)} />
    </>
  );
}
