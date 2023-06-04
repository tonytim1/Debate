import { Card, Fade } from '@mui/material';
import React from 'react';
import 'src/components/Cards/Cards.css'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  Stack,
  TextField,
  Divider,
  Chip,
  Autocomplete,
  Grid,
  Button,
  IconButton,
} from '@mui/material';
// sections
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';


const SignupCard = ({showCard, onBackClick}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState('');

    if (!showCard){
        return null;
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
    
    const handleSignUp = async () => {
    try {
        //user details
        const newUser = {
        email: email,
        password: password,
        name: name,
        username: username,
        tags: tags,
        image: image
        };

        // Send the new user data to the backend server
        const response = await fetch('http://' + window.location.hostname + ':8000/api/signup', {
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
            window.location.reload();
            } else {
            console.error('Failed to sign up');
        }
    } catch (error) {
        console.error(error);
    }
    };

    const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setImage(file);
};

const handleTagsChange = (event, value) => {
    setTags(value);
};

return (
    <div className="base-card">
        <div className="overlay-background" />
        <Card className='welcome-card' sx={{width:'90%'}}>
            <Stack>
                <IconButton
                        sx={{ position: 'absolute', left: 15, top: 15}}
                        onClick={onBackClick}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
                    Sign Up
                </Typography>
            </Stack>
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
                <TableCell></TableCell>
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
        </Card>
        </div>
    );
}

export default SignupCard;