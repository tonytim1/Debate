import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, TextField, Stack, Typography, Autocomplete } from '@mui/material';
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { doc, getDoc, updateDoc, getDocs, collection} from 'firebase/firestore';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/material/styles';
import useAuthentication from "../hooks/useAuthentication";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];


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
  const navigate = useNavigate();

  const isAuthenticated = useAuthentication();
  console.log("isAuthenticated: " + isAuthenticated)

  const socket = io('ws://' + window.location.hostname + ':5000');

  const fetchRooms = async () => {
    socket.emit('fetch_all_rooms');
  };

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/dashboard/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      fetchRooms();
      socket.once('all_rooms', (rooms) => {
        const mappedRooms = new Map(Object.entries(rooms));
        mappedRooms.forEach((data) => {
          data.color = getRandomColor(); // Add random color to each room
        });
        setRoomsData(mappedRooms);
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(roomsData);
    filterRooms('');
  }, [roomsData]);

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
            <Button size="small" variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {navigate("/dashboard/createRoom")}}>
              Create Room
            </Button>
          </Stack>
          <Grid container spacing={3} justifyContent="center">
            {filteredRooms.map(([roomId, data]) => (
              <BlogPostCard key={roomId} room={data} roomId={roomId} color={data.color} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
