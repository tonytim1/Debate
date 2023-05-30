import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, TextField, Stack, Typography, Autocomplete } from '@mui/material';
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];


// ----------------------------------------------------------------------

export default function HomePage() {
  const [roomsData, setRoomsData] = useState(new Map());
  
  const socket = io('ws://' + window.location.hostname + ':5000');

  // const fetchRooms = async () => {
    

  // };

  useEffect(() => {
    const fetchData = async () => {
      socket.emit('fetch_all_rooms');
      socket.on('all_rooms', (rooms) => {
        console.log(rooms);
        const roomsMap = new Map(Object.entries(rooms));
        setRoomsData(roomsMap);
        console.log(roomsData);
      });
    };
  
    fetchData();
  }, []);

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
              <TextField label="Search for debates"/>
              <Button size="small" variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />}>
                Create Room
              </Button>
          </Stack>
          {/* <Grid container spacing={3}>
            {roomsData.map((roomId, data) => (
              <BlogPostCard key={roomId} index={0} room={data} />
              ))}
          </Grid> */}
        </Stack>
      </Container>
    </>
  );
}
