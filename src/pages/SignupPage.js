import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { Box } from "@mui/system";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TextField,
  Divider,
  Chip,
  Autocomplete,
  Grid,
  Button
} from '@mui/material';
// sections
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { collection, addDoc, setDoc, doc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';



export default function SignUpPage() {

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleSignUp = async () => {
    try {
      //user details
      const newUser = {
        email: email,
        password: password,
        name: name,
        username: username,
        tags: tags,
      };

      // Send the new user data to the backend server
      const response = await fetch('http://' + window.location.hostname + ':5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const responseData = await response.json();
        const userURL = `/user/${responseData.userId}`;
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userId', responseData.userId);
        console.log(localStorage.getItem("token"));
        navigate('/');
      } else {
        console.error('Failed to sign up');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleTagsChange = (event, value) => {
    setTags(value);
  };

  // const handleSubmit = async () => {
  //   try {
  //     // Create a new room object
  //     const newUser = {
  //       first_name: first_name,
  //       last_name: last_name,
  //       email: email,
  //       username: username,
  //       password: password,
  //       tags: tags,
  //     };

  //     // const firestore = getFirestore();
  //     // const storage = getStorage();

  //     // if (selectedImage) {
  //     //   const storageRef = ref(storage, `images/${selectedImage.name}`);
  //     //   const storageSnapshot = await uploadBytes(storageRef, selectedImage);
  //     //   const imageUrl = await getDownloadURL(storageSnapshot.ref);

  //     //   newUser.image = imageUrl;
  //     // }

  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;


  //     // Add the user to Firebase Firestore
  //     const docRef = await addDoc(collection(firestore, 'users'), newUser);
  //     //const usersRef = await setDoc(doc(firestore, 'users', docRef.id));
  //     console.log("User added with ID: ", docRef.id);

  //     const userURL = `/user/${docRef.id}`;
  //     navigate(userURL);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <Helmet>
        <title> Debate Center | Sign Up </title>
      </Helmet>
      <Container>

        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          Sign Up
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Table style={{ width: "70%", maxWidth: "none" }} sx={{ margin: '0 auto' }}>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField label="Your Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              </TableCell>
              <TableCell>
                <TextField label="Last Name"
                  fullWidth/>
              </TableCell>
              <TableCell rowSpan={3}>
                <Grid item xs={12} textAlign="center">
                  <input
                    accept="image/*"
                    id="upload-image"
                    multiple
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', maxWidth: 300 }}
                    />
                  ) : (
                    <img
                      src={require('src/sections/register/placeholder.png')}
                      alt="Placeholder"
                      style={{ width: '100%', height: '100%', maxWidth: 250 }}
                    />
                  )}
                  <br></br>
                  <label htmlFor="upload-image">
                    <Button variant="contained" component="span">
                      Upload Profile Picture
                    </Button>
                  </label>
                </Grid>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </TableCell>
              <TableCell>
                <TextField label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField label="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </TableCell>
              <TableCell>
                <TextField label="Confirm Password" fullWidth type="password" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          What Interest You?
        </Typography>

        <Grid item xs={8} style={{ width: "50%", maxWidth: "none" }} sx={{ margin: '0 auto' }}>
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
              />
            )}
          />
        </Grid>



      </Container>
      <Divider sx={{ my: 3 }} />
      <LoadingButton
        sx={{ display: 'block', margin: '0 auto' }}
        type="submit"
        size="large"
        variant="contained"
        onClick={handleSignUp}
      >
        Create Account
      </LoadingButton>



    </>
  );
}
