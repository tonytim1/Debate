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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';

export const AccountProfileDetails = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [tags, setTags] = useState([]);
    const [usernameMiss, setUsernameMiss] = useState(null);

    const validateForm = (username) => {
        const username_err = !username
        setUsernameMiss(username_err);
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
            const response = await fetch('http://' + window.location.hostname + ':8000/api/update_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginUser),
            });
            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userId', responseData.userId);
                localStorage.setItem('finishBoardingPass', 'true');
                window.location.reload();
            }
        }
        catch (error) {
            console.log(error);
        }
    };

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
    }

    return (

        <Stack justifyContent="center" alignItems="center">
            <Stack direction="column" spacing={2} alignItems="center">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={localStorage.getItem('photoURL')}
                        sx={{ width: 100, height: 100 }}
                    />
                </div>
                <Grid
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label={usernameMiss ? "Username Is Missing" : "Username"}
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
                <Card className='welcome-card' sx={{ width: '90%' }}>
                    <IconButton
                        sx={{ position: 'absolute', left: 15, top: 15 }}
                        onClick={onBackClick}
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