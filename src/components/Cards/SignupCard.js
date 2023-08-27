import React from 'react';
import 'src/components/Cards/Cards.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from "@mui/system";
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import {
    Card, CardActions, CardContent, Avatar,
    Typography,
    Stack,
    TextField,
    Divider,
    Chip,
    Autocomplete,
    Button,
    IconButton,
} from '@mui/material';

const SignupCard = ({ showCard, onBackClick, onFirstTimeUser }) => {
    // fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [conf_password, setConfPassword] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [image, setImage] = useState(null);

    // errors
    const [emailMissingBool, setEmailMissingBool] = useState(false);
    const [emailMissingText, setEmailMissingText] = useState('');
    const [usernameMissing, setUsernameMissing] = useState(false);
    const [usernameExsistText, setUsernameExsistText] = useState('');
    const [passwordMissingBool, setPasswordMissing] = useState(false);
    const [confPasswordBool, setConfPasswordMissing] = useState(false);
    const [passwordMissingText, setPasswordMissingText] = useState('');
    const [confpasswordMissingText, setconfpasswordMissingText] = useState('');
    
    // consts
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

    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    const handleImageChange = async (event) => {
        setImage(event.target.files[0]);
        setSelectedImage(URL.createObjectURL(event.target.files[0]));
    };

    const validateForm = (email, password, conf_pass, username) => {
        /* validate the email, password and username */

        const email_err = !email;
        const email_err_message = !email ? 'Email is missing': '';
        const pass_err = !password || password.length < 6;
        const pass_err_message = !password ? 'Password is missing' : 'Password is under 6 chars';
        const conf_err = !conf_pass || conf_pass !== password;
        const conf_err_message = !conf_pass ? 'Confirm pass is missing' : 'Password did not match';
        const username_err = !username;
        const username_err_message = !username ? 'Username is missing': '';

        setEmailMissingBool(email_err)
        setPasswordMissing(pass_err)
        setUsernameMissing(username_err)
        setConfPasswordMissing(conf_err)

        setEmailMissingText(email_err_message)
        setPasswordMissingText(pass_err_message)
        setconfpasswordMissingText(conf_err_message)
        setUsernameExsistText(username_err_message)


        return !(email_err || pass_err || username_err || conf_err)
    };

    const handleSignUp = async () => {
        try {
            // user details
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
            const responseData = await response.json();
            if (response.ok) {
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userId', responseData.userId);
                localStorage.setItem('tags', responseData.tags);
                localStorage.setItem('provider', 'password');
                setEmailMissingBool(false);
                setUsernameMissing(false);

                // upload profile photo
                try {
                    const formData = new FormData();
                    formData.append('file', image); 
                    formData.append('token', responseData.token);
                    formData.append('username', newUser.username);
                    
                    const imageResponse = await fetch('http://' + window.location.hostname + ':8000/api/upload_image', {
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

                localStorage.setItem('UserAuthenticated', 'true');
                onFirstTimeUser();

            } else {
                if ('email' in responseData){
                    setEmailMissingBool(true);
                    setEmailMissingText(responseData.email);
                }
                else {
                    if ('username' in responseData){
                        setUsernameMissing(true);
                        setUsernameExsistText(responseData.username);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }


    };

    const handleInitializeClick = async (e) => {
        e.preventDefault();
        if (validateForm(email, password, conf_password, username)) {
            handleSignUp();
        }
    };

    if (!showCard) {
        return null;
    }

    return (
        <div className="base-card">
            <div className="overlay-background" />
            <Card className='welcome-card' sx={{
            minHeight: 'fit-content',
            minWidth: 'fit-content',
            width: '80%',
            maxWidth: '500px',
            maxHeight: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            }}>
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
                                    label={emailMissingBool ? emailMissingText : "Email Address"}
                                    error={emailMissingBool}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <TextField
                                    fullWidth
                                    required
                                    value={username}
                                    label={usernameMissing ?  usernameExsistText : "Username"}
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
                                    label={passwordMissingBool ? passwordMissingText : "Password"}
                                    error={passwordMissingBool}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <TextField
                                    fullWidth 
                                    required
                                    type="password"
                                    value={conf_password}
                                    label={confPasswordBool ? confpasswordMissingText : "Confirm Password"}
                                    error={confPasswordBool}
                                    onChange={(e) => setConfPassword(e.target.value)} />
                            </div>

                        </div>
                        <Divider sx={{ my: 3 }} />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
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

                        <Divider sx={{ my: 3 }} />
                        <LoadingButton
                            sx={{ display: 'block', margin: '0 auto', background: 'green' }}
                            type="submit"
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