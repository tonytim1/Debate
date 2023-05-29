import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
//firebase
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';

import { useState, useEffect } from 'react';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function HomePage() {
  const [roomsData, setRoomsData] = useState([]);

  // // Function to fetch all rooms from the "rooms" collection
  // const fetchRooms = async () => {
  //   try {
  //     // Get a reference to the "rooms" collection
  //     // const roomsRef = collection(firestore, 'rooms');

  //     // Get all documents in the "rooms" collection
  //     const querySnapshot = await getDocs(roomsRef);

  //     // Create an array to store the fetched rooms
  //     const rooms = [];

  //     // Loop through the documents and extract the room data
  //     querySnapshot.forEach((doc) => {
  //       const roomData = doc.data();
  //       rooms.push(roomData);
  //     });

  //     // Set the state with the fetched rooms
  //     setRoomsData(rooms);
  //     console.log({rooms})
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchRooms();
  // }, []);

  return (
    <>
      <Helmet>
        <title> Debate Center | Home </title>
      </Helmet>

      <Container>
        <Stack alignItems="center" justifyContent="space-between"  mb={1}>
          <Typography variant="h2">
            Debate Center
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Create room
          </Button> */}
        </Stack>
        <Stack direction="row"  alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h8" align="center" >
            Discover diverse perspectives, ignite meaningful discussions
          </Typography>
        </Stack>
        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between"> */}
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
            <BlogPostsSearch posts={roomsData} placeholder="Search for debates"/>
        </Stack>

        <Grid container spacing={3}>
          {roomsData.map((room, index) => (
            <BlogPostCard key={index} index={index} room={room} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
