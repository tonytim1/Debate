import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import POSTS from 'src/_mock/blog';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from 'src/sections/@dashboard/blog';
// import {
//   first_name,
//   last_name,
//   email,
//   phone,
//   password,
  
// } from 'src/pages/SignupPage.js';

import SignUpPage from 'src/pages/SignupPage';

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
  Divider
} from '@mui/material';
// sections
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import Gender from 'src/_mock/register'
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
        <title> Sign Up </title>
      </Helmet>
      <Container>
        <Divider sx={{ my: 3 }}/>
        
        <Table style={{width: "70%", maxWidth: "none"}} sx={{ margin: '0 auto' }}>
      <TableBody>
        <TableRow>
          <TableCell>
            <TextField label="First Name" 
            fullWidth 
            value={SignUpPage.first_name} 
            onChange={(e) => SignUpPage.setFirstName(e.target.value)}/>
          </TableCell>
          <TableCell>
            <TextField label="Last Name"
            fullWidth 
            value={SignUpPage.last_name}
            onChange={(e) => SignUpPage.setLastName(e.target.value)}/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <TextField label="Email"
            fullWidth
            value={SignUpPage.email}
            onChange={(e) => SignUpPage.setEmail(e.target.value)}/>
          </TableCell>
          <TableCell>
            <TextField label="Phone Number" fullWidth value={SignUpPage.phone}/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <TextField label="Password" fullWidth type="password" value={SignUpPage.password}/>
          </TableCell>
          <TableCell>
            <TextField label="Confirm Password" fullWidth type="password" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Divider sx={{ my: 3 }}/>
    <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
    What Interest You?
            </Typography>


        

      </Container>
    </>
  );
}
