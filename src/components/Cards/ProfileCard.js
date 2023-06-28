import { Box, TextField, CardHeader, Avatar, Button, Card, CardActions, CardContent, Divider, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import useAuthentication from "../../hooks/useAuthentication";
import LoadingScreen from 'src/components/Room/LoadingScreen';
import { Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { blue, red } from '@mui/material/colors';
import { Google, Facebook } from '@mui/icons-material';

export const AccountProfileDetails = ({ user }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState([]);
  const [provider, setProvider] = useState('');



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

  useEffect(() => {
    if (user) {
      if (user.hasOwnProperty('name')) {
        setName(user.name);
      }
      if (user.hasOwnProperty('email')) {
        setEmail(user.email);
      }
      if (user.hasOwnProperty('password')) {
        setPassword(user.password);
      }
      if (user.hasOwnProperty('username')) {
        setUsername(user.username);
      }
      if (user.hasOwnProperty('tags')) {
        setTags(user.tags);
      }
      if (user.hasOwnProperty('provider')) {
        setProvider(user.provider);
      }
    }
  }, [user]);

  const handleTagsChange = (event, value) => {
    setTags(value);
  }


  const handleUpdateDetails = async () => {
    const UpdatedUser = {
      email: email,
      name: name,
      username: username,
      tags: tags,
      image: '',
      provider: provider,
      token: localStorage.getItem('token')
    };

    const response = await fetch('http://' + window.location.hostname + ':8000/api/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(UpdatedUser),
    });
    if (response.ok) {
      if (UpdatedUser.username !== '') {
        localStorage.setItem('userId', UpdatedUser.username);
      }
      else {
        localStorage.setItem('userId', UpdatedUser.name);
      }
      const homepage = "/dashboard/home";
      navigate(homepage);
    }
  };

  return (
    <form
      autoComplete="off"
      noValidate
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
                  label="Name"
                  name="Name"
                  disabled={user.provider !== 'password'}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  disabled
                  onChange={(e) => setUsername(e.target.value)}
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
                <Grid
                  xs={12}
                  md={6}
                >
                  <Autocomplete
                    multiple
                    fullWidth
                    id="tags-outlined"
                    options={tagOptions}
                    freeSolo
                    value={tags}
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
                      />
                    )}
                  />
                </Grid>

              </Grid>
            </Grid>
          </Box>
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'center', m: 1.5 }}>
          <Button variant="contained" onClick={handleUpdateDetails}>
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
        <Typography>
          {/* {user.hasOwnProperty('name') ? user.name : "No Name"} */}
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
  const [config, setConfig] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const getAuth = async () => {
      try {
        const response = await axios.get('http://' + window.location.hostname + ':8000/api/get_auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getAuth();
  }, []);

  const handleLogout = async () => {
    const user = {
      token: localStorage.getItem('token'),
      provider: localStorage.getItem('provider')
    };
    try {
      const response = await fetch('http://' + window.location.hostname + ':8000/api/delete_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {

        // if (user.provider !== 'password') {
        //   pass
        // }
        console.log("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("photoURL");
        localStorage.removeItem("provider");
        const homepage = "/dashboard/home";
        navigate(homepage);

      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const BackButton = () => {
    window.history.back();
  };


  useEffect(() => {
    const getUserData = async () => {
      if (localStorage.getItem('token') !== null) {
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
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return (
      <LoadingScreen />
    );
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
        <IconButton color="primary" onClick={BackButton}>
          <ArrowBack />
        </IconButton>





        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Account Details
              </Typography>
              <CardActions sx={{ justifyContent: 'left', m: 1.5 }}>
                <Button variant="contained" onClick={handleLogout} style={{ background: red[800] }} >
                  Delete Account
                </Button>
              </CardActions>
            </div>
            <div>
              {user.provider !== 'password' && (
                <Card variant="outlined" style={{ width: '370px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                  {user.provider === 'google.com' && <div style={{ marginRight: '10px', color: red[600] }}>
                    <Google />
                  </div>}
                  {user.provider === 'facebook.com' && <div style={{ marginRight: '8px', color: blue[500] }}>
                    <Facebook />
                  </div>}
                  <div style={{ color: blue[900] }}>
                    You have signed in with '{user.provider}' account, you can add more details here :)
                  </div>
                </Card>
              )}
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                {user.provider === 'password' && (
                  <Grid xs={12} md={6} lg={8}>
                    <AccountProfile user={user} />
                  </Grid>
                )}

                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfileDetails user={user} />
                </Grid>

              </Grid>
            </div>
          </Stack>
        </Container>
      </Box >
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
      width: 300,
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