import { Card, Fade, CardActions, CardContent, Avatar, Collapse, Alert } from '@mui/material';
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


const SignupCard = ({ showCard, onBackClick }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [image, setImage] = useState('');

    const [SignUpFailed, setSignUpFailed] = useState(false);
    const [emailMissing, setEmailMissing] = useState(false);
    const [passwordMissing, setPasswordMissing] = useState(false);
    const [usernameMissing, setUsernameMissing] = useState(false);

    const validateForm = (email, password, username) => {
        const email_err = !email
        const pass_err = !password
        const username_err = !username

        setEmailMissing(email_err);
        setPasswordMissing(pass_err)
        setUsernameMissing(username_err)
        console.log(email_err, pass_err, username_err)

        return !(email_err || pass_err || username_err)
    };

    const handleInitializeClick = async (e) => {
        e.preventDefault();
        if (validateForm(email, password, username)) {
            console.log("valid")
            handleSignUp();
        }
    };


    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setImage(file);
    };


    if (!showCard) {
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
                setSignUpFailed(false);
                window.location.reload();
            } else {
                setSignUpFailed(true);
                console.error('Failed to sign up');
            }
        } catch (error) {
            setSignUpFailed(true);
            console.error(error);
        }
    };



    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    return (
        <div className="base-card">
            <div className="overlay-background" />
            <Card className='welcome-card' sx={{ width: '90%' }}>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Stack>
                        <IconButton
                            sx={{ position: 'absolute', left: 15, top: 15 }}
                            onClick={onBackClick}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
                            Sign Up
                        </Typography>

                        <Divider sx={{ my: 3 }} />
                        <div>
                            <div>
                                <TextField
                                    fullWidth
                                    required
                                    value={email}
                                    label={emailMissing ? "Email Is Missing" : "Email Address"}
                                    error={emailMissing}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <TextField
                                    fullWidth
                                    required
                                    value={username}
                                    label={usernameMissing ? "Username Is Missing" : "Username"}
                                    error={usernameMissing}
                                    onChange={(e) => setUsername(e.target.value)} />


                            </div>

                            <Stack direction="row" alignItems='center' justifyContent='center' >
                                <TextField label="Your Name"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />

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
                            </Stack>

                            <div>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    value={password}
                                    label={passwordMissing ? "Password Is Missing" : "Password"}
                                    error={emailMissing}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <TextField label="Confirm Password" fullWidth type="password" />
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                accept="image/*"
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
                                        <Button variant="contained" component="span">
                                            Upload Profile Picture
                                        </Button>
                                    </label>
                                </CardActions>
                            </Card>
                        </div>
                        <Collapse in={SignUpFailed}>
                            <Alert severity="error">
                                Login failed, check again your email and password
                            </Alert>
                        </Collapse>


                        <Divider sx={{ my: 3 }} />
                        <LoadingButton
                            sx={{ display: 'block', margin: '0 auto', background: 'green' }}
                            type="submit"
                            size="large"
                            variant="contained"
                            onClick={handleInitializeClick}
                        >
                            Create Account
                        </LoadingButton>

                    </Stack>
                </Box>
            </Card>

        </div>
    );
}
export default SignupCard;