import { Box, TextField, CardHeader, Avatar, Button, Card, CardActions, CardContent, Divider, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useCallback, useState, useEffect } from 'react';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import useAuthentication from "../hooks/useAuthentication";



const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const AccountProfileDetails = ({ user }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
      setPassword(user.password);
      setTags(user.tags);
    }
  }, [user]);

  const handleSubmit = async () => { };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >

      <Card>
        <CardHeader
          title="Profile"
        />
        <br></br>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email"
                  name="Email"
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  value={email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Password"
                  name="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  value={username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <MultipleSelectTopic />
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', m: 1.5 }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};


export const AccountProfile = ({ user }) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar

          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography variant="body2">
          {user.name !== null ? user.name : "No Name"}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions>
  </Card>
);
const Page = () => {
  const isAuthenticated = useAuthentication();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Send the new user data to the backend server
        const response = await axios.get('http://' + window.location.hostname + ':8000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Account
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile user={user} />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <AccountProfileDetails user={user} />
                </Grid>
              </Grid>
            </div>
          </Stack>

        </Container>
      </Box>
    </>
  );
};
export default Page;





const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Topics = [
  'Economy',
  'veganism',
  ' Russia-Ukraine war',
  'politics',
  'environment',
  'philosophy',
  'Biden',
  'Karl Marx',
  'Law reform',
];

function getStyles(name, topicName, theme) {
  return {
    fontWeight:
      topicName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectTopic() {
  const theme = useTheme();
  const [topicName, settopicName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    settopicName(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ width: 550 }}>
        <InputLabel id="demo-multiple-chip-label">Relevant issues</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={topicName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {Topics.map((topic) => (
            <MenuItem
              key={topic}
              value={topic}
              style={getStyles(topic, topicName, theme)}
            >
              {topic}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};