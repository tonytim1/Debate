import { Box, TextField, CardHeader, Avatar, Button, Card, CardActions, CardContent, Divider, Container, Stack, Typography, Unstable_Grid2 as Grid, AlertTitle } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import LoadingScreen from 'src/components/Room/LoadingScreen';
import { Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { blue, red } from '@mui/material/colors';
import { Google, Facebook } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref}  {...props} />;
});

const Page = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState([]);
  const [provider, setProvider] = useState('');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [image, setImage] = useState(null);
  const [isSnackbarOpenDelete, setIsSnackbarOpenDelete] = useState(false);
  const [isSnackbarOpenUpdate, setIsSnackbarOpenUpdate] = useState(false);
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
  useEffect(() => { if ( localStorage.getItem('UserAuthenticated') !== 'true' )  navigate('/');  });

  const handleImageChange = async (event) => {
    setImage(event.target.files[0]);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleTagsChange = (event, value) => {
    setTags(value);
  };

  const handleUpdateDetails = async () => {
    const UpdatedUser = {
      name: name,
      tags: tags,
      token: localStorage.getItem('token')
    };

    const response = await fetch('https://debate-back.onrender.com/api/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(UpdatedUser),
    });
    if (response.ok) {
      localStorage.setItem('tags', response.tags);

      if (image !== null) {
        // upload profile photo
        try {
          const formData = new FormData();
          formData.append('file', image);
          formData.append('token', UpdatedUser.token);
          formData.append('username', localStorage.getItem('userId'));

          const imageResponse = await fetch('https://debate-back.onrender.com/api/upload_image', {
            method: 'POST',
            body: formData,
          });
          const imageResponseData = await imageResponse.json();
          if (imageResponse.ok) {
            localStorage.setItem('profilePhotoURL', imageResponseData.profilePhotoURL);
            console.log('Image uploaded successfully');
          } else {
            console.error(imageResponseData);
          }
        } catch (error) {
          console.error(error);
        }
      }
      setIsSnackbarOpenUpdate(true);
      setTimeout(() => {
        const homepage = "/dashboard/home";
        navigate(homepage);
      }, 1000);
      // window.location.reload();
    }
  };

  const handleDelete = async () => {
    const user = {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('userId')
    };
    try {
      const response = await fetch('https://debate-back.onrender.com/api/delete_user', {
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
        localStorage.removeItem("tags");
        localStorage.removeItem("profilePhotoURL");
        localStorage.removeItem("provider");
        localStorage.removeItem("UserAuthenticated");
        setIsSnackbarOpenDelete(true);
        setTimeout(() => {
          const homepage = "/dashboard/home";
          navigate(homepage);
        }, 1000);

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
          const response = await axios.get('https://debate-back.onrender.com/api/user', {
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

  useEffect(() => {
    if (user) {
      if (user.hasOwnProperty('email')) {
        setEmail(user.email);
      }
      if (user.hasOwnProperty('name')) {
        setName(user.name);
      }
      if (user.hasOwnProperty('username')) {
        setUsername(user.username);
      }
      if (user.hasOwnProperty('tags')) {
        setTags(user.tags);
      }
      if (user.hasOwnProperty('image')) {
        setSelectedImage(user.image);
      }
      if (user.hasOwnProperty('provider')) {
        setProvider(user.provider);
      }
    }
  }, [user]);

  const closeSnackbarDelete = () => {
    setIsSnackbarOpenDelete(false);
  };

  const closeSnackbarUpdate = () => {
    setIsSnackbarOpenUpdate(false);
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <Container maxWidth="lg">
        <Snackbar
        open={isSnackbarOpenDelete}
        autoHideDuration={6000} // Adjust the duration as needed
        onClose={closeSnackbarDelete}
        anchorOrigin={{
          vertical: 'top',  // Set the vertical position of the Snackbar (top, bottom)
          horizontal: 'center'  // Set the horizontal position of the Snackbar (left, center, right)
        }}
      >
        <Alert onClose={closeSnackbarDelete} severity="success">
        <AlertTitle>Account deletion successful!</AlertTitle>
        </Alert>
      </Snackbar>

      <Snackbar
        open={isSnackbarOpenUpdate}
        autoHideDuration={6000} // Adjust the duration as needed
        onClose={closeSnackbarUpdate}
        anchorOrigin={{
          vertical: 'top',  // Set the vertical position of the Snackbar (top, bottom)
          horizontal: 'center'  // Set the horizontal position of the Snackbar (left, center, right)
        }}
      >
        <Alert onClose={closeSnackbarUpdate} severity="success">
        <AlertTitle>Account updation successful!</AlertTitle>
        </Alert>
      </Snackbar>


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
        )}

        <form
          autoComplete="off"
          noValidate
          style={{ width: '100%' }}
        >

          <Card style={{ width: '100%' }}>

            <br></br><br></br>
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
                    label="Username"
                    name="Username"
                    disabled
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />

                  <TextField
                    fullWidth
                    label="Name"
                    name="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
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

        <Button variant="contained" onClick={handleDelete} style={{ background: red[800] }} >
          Delete Account
        </Button>
      </Stack>
    </Container>
  );
};
export default Page;
