import React from 'react';
import 'src/components/Cards/Cards.css'
import { LoginForm } from 'src/sections/auth/login';
import { CardActionArea, Divider, Fade } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Autocomplete, Tooltip, Tab, Grid, CardMedia, CardContent, CardActions, FormControlLabel, Box, Stack, Button, Container, Slider, Typography, Switch, Chip, Card, Portal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { createClient } from 'pexels';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {CircularProgress} from '@mui/material';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const CreateRoomCard = ({ showCard, onCloseClick }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [tags, setTags] = useState([]);
    const [size, setSize] = useState(4);
    const [allowSpectators, setAllowSpectators] = useState(false);
    const [teams, setTeams] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [tagsErr, setTagsErr] = useState(false);
    const [time_to_start, setTime_to_start] = useState(15);
    const [currentTab, setCurrentTab] = useState(true); // Initial tab value
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);

    const currUserId = localStorage.getItem("userId")
    const client = createClient('Y9u8WmqtGw5byBRfqAo3KXkYs9Lixx7K4gdI8eEYw7dpilWDWBUx4N0j');

    const checkRoomName = () => {
      // checks if there are at least 3 words
      if (name.trim().split(/\s+/).length < 3) {
        setNameErr(true);
        return false;
      } else {
        setNameErr(false);
        return true;
      }
    };
    
    const checkTags = () => {
      if (tags.length < 1) {
        setTagsErr(true);
        return false;
      } else {
        setTagsErr(false);
        return true;
      }
    };
    
    const handlePictureSelect = (photo) => {
      setSelectedPicture(photo);
      setCurrentTab('1');
    };

    const handleSearch = async () => {
      setLoading(true);
      setSearchResults([]);
    
      try {
        const response = await client.photos.search({
          query: searchQuery,
          per_page: 20, // Number of results per page
        });
    
        setSearchResults(response.photos.slice(0, 20));
      } catch (error) {
        console.error(error);
      }
    
      setLoading(false);
    };    

    const handleSubmit = async () => {
      const name_ok = checkRoomName();
      const tags_ok = checkTags();
    
      if (name_ok && tags_ok) {
        try {
          const newRoom = {
            name: name,
            tags: tags,
            teams: teams,
            room_size: size,
            time_to_start: time_to_start,
            allow_spectators: allowSpectators,
            moderator: currUserId,
            pictureId: selectedPicture ? selectedPicture.id : -1,
          };
    
          // Send the new room data to the backend server
          const response = await fetch('http://' + window.location.hostname +':8000/api/create_room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRoom),
          });
    
          if (response.ok) {
            const responseData = await response.json();
            const roomURL = `/room/${responseData.roomId}`;
            navigate(roomURL);
          } else {
            console.error('Failed to create room');
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    
    const handleSizeSliderChange = (event, newValue) => {
      setSize(newValue);
    };
    
    const handleTimeSliderChange = (event, newValue) => {
      setTime_to_start(newValue);
    };
    
    const handleTagsChange = (event, value) => {
      setTags(value);
    };

    useEffect(() => {
      setSelectedPicture(null);
      setSearchResults([]);
      setSearchQuery("");
      setCurrentTab(true);
    }, [showCard]);

    if (!showCard) {
      return null; // Return null if the prop is false, hiding the component
    }
  
    return (
    <Fade in={showCard}>
      <div className="base-card">
        <div className="overlay-background" />
          {currentTab ? (
          <Card className='welcome-card' sx={{
            minHeight: 'fit-content',
            minWidth: 'fit-content',
            width: '80%',
            maxWidth: '500px',
            maxHeight: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            }}
          >
              <Stack spacing={1.5} className='content'>
                  <Stack direction={'row'}>
                      <IconButton
                          sx={{ position: 'absolute', left: 15, top: 15}}
                          onClick={onCloseClick}
                      >
                          <CloseIcon />
                      </IconButton>
                      <Typography variant="h4">
                      Create Room
                      </Typography>
                  </Stack>
                  <TextField
                  name="Name"
                  label="Room Name"
                  variant="outlined"
                  helperText={nameErr ? 'Name needs to have at least 3 words' : ''}
                  fullWidth
                  error={nameErr}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  />
                  <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={tagOptions}
                  freeSolo
                  fullWidth
                  onChange={handleTagsChange}
                  renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                  }
                  renderInput={(params) => (
                      <TextField
                      {...params}
                      variant="outlined"
                      label="Tags (topic)"
                      placeholder="Choose topics or write your own tags"
                      error={tagsErr}
                      helperText={tagsErr ? 'Choose or write at least 1' : ''}
                      style={{ width: '100%'}}
                      />
                  )}
                  />
                  <Typography id="input-slider" gutterBottom>
                  Max Participants:
                  </Typography>
                  <Box display="flex" alignItems="center" width="80%">
                  <Slider
                      aria-label=""
                      defaultValue={4}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={2}
                      max={10}
                      onChange={handleSizeSliderChange}
                  />
                  <Typography variant="body1" style={{ marginLeft: '18px' }}>
                      {size}
                  </Typography>
                  </Box>
                  <Typography id="input-slider" gutterBottom>
                  Time To Start (mins):
                  </Typography>
                  <Box display="flex" alignItems="center" width="80%">
                  <Slider
                      aria-label="aa"
                      defaultValue={15}
                      valueLabelDisplay="auto"
                      step={5}
                      marks
                      min={5}
                      max={60}
                      onChange={handleTimeSliderChange}
                  />
                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                      {time_to_start}
                  </Typography>
                  </Box>
                  <Box>
                  <Stack>
                    <Tooltip placement="left" arrow title="Toggle on to let users choose side on the topic">
                      <FormControlLabel
                      control={<Switch checked={teams} onChange={() => setTeams(!teams)} name="gilad" />}
                      label="Teams"
                      />
                    </Tooltip>
                    <Tooltip placement="left" arrow title="Toggle on to let users to watch the debate without being in the video chat">
                      <FormControlLabel
                      control={
                          <Switch checked={allowSpectators} onChange={() => setAllowSpectators(!allowSpectators)} name="gilad" />
                      }
                      label="Spectators"
                      />
                    </Tooltip>
                  </Stack>
                  </Box>
                  <Stack spacing={2} direction={"row"}>
                  <Button type="submit" variant="contained" onClick={handleSubmit}>
                      Create
                  </Button>
                  <Button type="submit" variant={selectedPicture ? "contained" : "outlined"} color={selectedPicture ? "success" : "primary"} onClick={() => setCurrentTab(false)}>
                      {selectedPicture ? ":)" : "Add Picture"}
                  </Button>
                  </Stack>
              </Stack>
          </Card>
          ) :
          (
            <Card className='welcome-card' sx={{
              minHeight: 'fint-content',
              minWidth: '30%',
              width: '500px',
              maxWidth: '70%',
              maxHeight: '70%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}
            >
              <Stack>
                <Stack direction={"row"} sx={{width: '100%', justifyContent: 'center'}}>
                  <IconButton
                      sx={{ position: 'absolute', left: 15, top: 15}}
                      onClick={() => setCurrentTab(true)}
                      >
                      <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h6">Search for Pictures</Typography>
                </Stack>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={loading}
                />

                {loading ? (
                  <CircularProgress size={24} sx={{ mt: 2 }} />
                ) : (
                <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                  <Grid container justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                    {searchResults.map((photo) => (
                      <Grid item key={photo.id}>
                        <Card sx={{ width: '100%', height: '100%' }}>
                          <CardActionArea onClick={() => handlePictureSelect(photo)}>
                            <CardMedia
                              component="img"
                              src={photo.src.small}
                              alt={photo.photographer}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
                )}
                <Stack spacing={2}>
                  <Button variant="contained" onClick={handleSearch} disabled={loading} sx={{ marginTop: '10px' }}>
                    Search
                  </Button>
                  <a href="https://www.pexels.com">
                      Photos provided by Pexels
                  </a>
                </Stack>
              </Stack>
            </Card>
        ) 
        }
      </div>
    </Fade>
    );    
  };
  
  
  const tagOptions = [
      "Music",
      "Climate change",
      "Health",
      "Religion And Spirituality",
      "Science",
      "Education",
      "Technology",
      "Sports",
      "Culture",
      "Politics",
    ];
    
export default CreateRoomCard;