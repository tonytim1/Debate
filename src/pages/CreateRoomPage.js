import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Autocomplete, FormControlLabel, Box, Grid, Button, Container, Slider, Typography, Switch, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [size, setSize] = useState(4);
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [teams, setTeams] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [tagsErr, setTagsErr] = useState(false);
  const [time_to_start, setTime_to_start] = useState(15);

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
          spectators: allowSpectators,
          ready_list: [],
          spectators_list: [],
          moderator: "moderator",
        };

        // Send the new room data to the backend server
        const response = await fetch('/api/create-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRoom),
        });

        if (response.ok) {
          const roomURL = `/room/${response.data.roomId}`;
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

  return (
    <>
      <Helmet>
        <title>Debate Center | Create Room</title>
      </Helmet>
      <Container>
        <Typography variant="h4" gutterBottom style={{ marginBottom: "30px" }}>
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
              control={<Switch checked={teams} onChange={() => { setTeams(!teams) }} name="gilad" />}
              label="Teams"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={allowSpectators} onChange={() => { setAllowSpectators(!allowSpectators) }} name="gilad" />}
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
