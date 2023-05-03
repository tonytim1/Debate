import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton, 
  TableContainer,
  TablePagination,
  TextField,
  Autocomplete,
  FormControlLabel,
  Grid,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import TOPIC_LIST from '../_mock/topics'
import {useNavigate, useHref} from 'react-router-dom';


export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(null);
  const [size, setSize] = useState(2);
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [mode, setMode] = useState('teams');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission here
  };

  return (
    <>
      <Helmet>
        <title> Debate Center | Create Room </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create Room
          </Typography>
        </Stack>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <TextField
              name="Name"
              label="Room Name"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Topic"
              options={TOPIC_LIST}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Topic" />}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Topic"
              options={['Teams', 'Free For All']}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Mode" />}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id="Size"
              options={[...Array(10).keys()]}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Room Size" type="number" />}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Allow Spectators" />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {navigate('/dashboard/room')}}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
