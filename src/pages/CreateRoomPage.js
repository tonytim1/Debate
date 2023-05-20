import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Autocomplete, FormControlLabel, Grid, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import TOPIC_LIST from '../_mock/topics';

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(null);
  const [size, setSize] = useState(2);
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [mode, setMode] = useState('teams');
  const [msg, setMsg] = useState('')

  const handleSubmit = () => {
    axios.get("http://localhost:5000/hello").then(response => {
      setMsg(response.data.msg);
    }).catch(error => {
      console.error("Failed to get the msg:", error);
    });
    console.log(msg);
  };

  return (
    <>
      <Helmet>
        <title>Debate Center | Create Room</title>
      </Helmet>
      <Container>
        <Typography variant="h4" gutterBottom>
          Create Room
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <TextField
              name="Name"
              label="Room Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Topic"
              options={TOPIC_LIST}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Topic" />}
              value={topic}
              onChange={(e, newValue) => setTopic(newValue)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Topic"
              options={['Teams', 'Free For All']}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Mode" />}
              value={mode}
              onChange={(e, newValue) => setMode(newValue)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Size"
              options={[...Array(10).keys()]}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Room Size" type="number" />}
              value={size}
              onChange={(e, newValue) => setSize(newValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<input type="checkbox" checked={allowSpectators} onChange={(e) => setAllowSpectators(e.target.checked)} />}
              label="Allow Spectators"
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