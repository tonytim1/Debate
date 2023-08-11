import { Box, TextField, Avatar, Button, Card, CardActions, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import LoadingScreen from 'src/components/Room/LoadingScreen';
import { Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const AccountProfileDetails = () => {
    const [username, setUsername] = useState('');
    const [tags, setTags] = useState([]);
    const [usernameMiss, setUsernameMiss] = useState(null);
    const [usernameMissText, setUsernameMissText] = useState('');
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


    const validateForm = (username) => {
        const username_err = !username
        const username_err_message = !username ? 'Username is missing': '';
        setUsernameMiss(username_err);
        setUsernameMissText(username_err_message);
        return !(username_err)
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (validateForm(username)) {
            validateUser(username, tags);
        }
    };

    const validateUser = async (username, tags) => {
        try {
            const loginUser = {
                username: username,
                tags: tags,
                token: localStorage.getItem('token'),
            };
            const response = await fetch('http://' + window.location.hostname + ':8000/api/update_stage_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginUser),
            });
            const responseData = await response.json();
            if (response.ok) {
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userId', responseData.userId);
                localStorage.setItem('tags', responseData.tags);
                localStorage.setItem('finishBoardingPass', 'true');
                window.location.reload();
            }
            else{
                setUsernameMiss(true);
                setUsernameMissText(responseData.error);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleTagsChange = (event, value) => {
        setTags(value);
    }

    return (
        <Stack justifyContent="center" alignItems="center" >
            <Stack direction="column" spacing={2} alignItems="center" >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={localStorage.getItem('profilePhotoURL')}
                        sx={{ width: 100, height: 100 }}
                    />
                </div>
                <Grid
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label={usernameMiss ? usernameMissText : "Username"}
                        error={usernameMiss}
                        style={{ width: '300px' }}
                        name="Username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </Grid>
                <Grid
                    xs={12}
                    md={6}
                >
                    <Autocomplete
                        multiple
                        fullWidth
                        style={{ width: '300px' }}
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
                <CardActions sx={{ alignItems: 'center', justifyContent: 'center', m: 1.5 }}>
                    <Button variant="contained" onClick={handleClick} >
                        Lets Debate!
                    </Button>
                </CardActions>
            </Stack>
        </Stack>
    );
};


const LoginStageCard = ({ showCard, onBackClick }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    const deleteTempUser = async () => {
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
    
          }
        }
        catch (error) {
          console.log(error);
        }
      };


    if (!showCard) {
        return null;
    }


    if (loading) {
        return (
            <LoadingScreen />
        );
    }


    return (
        <>
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
                <IconButton
                    sx={{ position: 'absolute', left: 15, top: 15 }}
                    onClick={() => {
                        onBackClick();
                        deleteTempUser();
                    }}
                >
                        <ArrowBackIcon />
                    </IconButton>
                    <Container maxWidth="lg">
                        <Stack spacing={3}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h4">
                                    Hello {localStorage.getItem('userId')}
                                </Typography>
                                <Typography variant="h9">
                                    Before we start, fill necessary details :)
                                </Typography>

                                <br></br>
                                <AccountProfileDetails />
                            </div>
                        </Stack>
                    </Container>
                </Card>
            </div>
        </>
    );
};
export default LoginStageCard;
