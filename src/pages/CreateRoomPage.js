import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Autocomplete, FormControlLabel, Box, Grid, Button, Container, Slider, Typography, Switch, Chip } from '@mui/material';
import axios from 'axios';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useNavigate } from 'react-router-dom';



export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(null);
  const [size, setSize] = useState(4);
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [teams, setTeams] = useState(false);
  const [msg, setMsg] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [name_msg, setName_msg] = useState('');
  const [tags, setTags] = useState([]);
  const [time_to_start, setTime_to_start] = useState(15);
  const [tagsErr, setTagsErr] = useState(false);
  
  const check_roomName = () => {
    // checks if there are at least 3 words
    if (name.trim().split(/\s+/).length < 3){
      setNameErr(true);
      return false;
    }
    else {
      setNameErr(false);
      return true;
    };
  };

  const check_tags = () => {
    if (tags.length < 1){
      setTagsErr(true);
      return false;
    }
    else{
      setTagsErr(false);
      return true;
    }
  };

  const handleSubmit = async () => {
    const name_ok = check_roomName();
    const tags_ok = check_tags();
  
    if (name_ok && tags_ok) {
      try {
        // Create a new room object
        const newRoom = {
          name: name,
          tags: tags,
          teams: teams,
          time_to_start: time_to_start,
          spectators: allowSpectators,
        };
  
        // Add the room to Firebase Firestore
        const docRef = await addDoc(collection(firestore, 'rooms'), newRoom);
        console.log("Room added with ID: ", docRef.id);

        const roomURL = `/room/${docRef.id}`;
        navigate(roomURL);

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

  return (
    <>
      <Helmet>
        <title>Debate Center | Create Room</title>
      </Helmet>
      <Container>
        <Typography variant="h4" gutterBottom style={{marginBottom: "30px"}}>
          Create Room
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <TextField
              name="Name"
              label="Room Name"
              variant="outlined"
              helperText={nameErr ? "Name needs to have at least 3 words" : ""}
              fullWidth
              error={nameErr}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={tagOptions}
            freeSolo
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
                helperText={tagsErr ? "Choose or write at least 1" : ""}
              />
            )}
          />
          </Grid>

          <Grid item xs={6}>
            <Typography id="input-slider" gutterBottom>
              Max Participants:
            </Typography>
            <Box display="flex" alignItems="center">
            <Slider
              aria-label=""
              defaultValue={4}
              // getAriaValueText={}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={2}
              max={10}
              onChange={handleSizeSliderChange}
            />
            <Typography variant="body1" style={{ marginLeft: '18px' }}>{size}</Typography>
            </Box>
            <Typography id="input-slider" gutterBottom>
              Time To Start (mins):
            </Typography>
            <Box display="flex" alignItems="center">
            <Slider
              aria-label="aa"
              defaultValue={15}
              // getAriaValueText={}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={5}
              max={60}
              onChange={handleTimeSliderChange}
            />
            <Typography variant="body1" style={{ marginLeft: '8px' }}>{time_to_start}</Typography>
            </Box>
          </Grid> 
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={teams} onChange={() => {setTeams(!teams)}} name="gilad" />}
              label="Teams"
            />
          </Grid>
          <Grid item xs={12}>
          <FormControlLabel
              control={<Switch checked={allowSpectators} onChange={() => {setAllowSpectators(!allowSpectators)}} name="gilad" />}
              label="Spectators"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

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
