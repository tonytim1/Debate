import { Box, TextField, CardHeader, Avatar, Button, Card, CardActions, CardContent, Divider, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
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
      localStorage.setItem('tags', UpdatedUser.tags);
      const homepage = "/dashboard/home";
      navigate(homepage);
    }
  };

  return (
    <form
      autoComplete="off"
      noValidate
      style={{ width: '100%' }}
    >

      <Card style={{ width: '100%' }}>
        <CardHeader
          title="Profile"
        />
        <br></br>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                name="Email"
                disabled
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
              />

              <TextField
                fullWidth
                label="Name"
                name="Name"
                disabled={user.provider !== 'password'}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />

              <TextField
                fullWidth
                label="Username"
                name="Username"
                disabled
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />

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
            </Stack>
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


export const AccountProfile = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [image, setImage] = useState(null);
  
  const handleImageChange = async (event) => {
    setImage(event.target.files[0]);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <Card style={{ width: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        accept="image/*"
        name='file'
        id="upload-image"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <Card sx={{ width: 200 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Add this line to center horizontally
            }}
          >
            <Avatar
              src={selectedImage ? selectedImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              sx={{
                height: 120,
                mb: 2,
                width: 120
              }}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <label htmlFor="upload-image">
            <Button variant="outlined" component="span">
              Upload Profile Picture
            </Button>
          </label>
        </CardActions>
      </Card>
    </div>
    </Card>
  );
};

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

  const handleDelete = async () => {
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
        console.log("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("profilePhotoURL");
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
    <Container maxWidth="lg">
      <IconButton color="primary" onClick={BackButton}>
        <ArrowBack />
      </IconButton>
      <Stack spacing={3} style={{ width: '100%', alignItems: 'center' }}>
        <div>
          <Typography variant="h4">
            Account Details
          </Typography>
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
        {user.provider === 'password' && (
          <AccountProfile user={user} />
        )}

        <AccountProfileDetails user={user} />

        <Button variant="contained" onClick={handleDelete} style={{ background: red[800] }} >
          Delete Account
        </Button>
      </Stack>
    </Container>
  );
};
export default Page;
