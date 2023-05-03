import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import POSTS from 'src/_mock/blog';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from 'src/sections/@dashboard/blog';
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
            <TextField label="First Name" fullWidth />
          </TableCell>
          <TableCell>
            <TextField label="Last Name" fullWidth />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <TextField label="Email" fullWidth />
          </TableCell>
          <TableCell>
            <TextField label="Phone Number" fullWidth />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <TextField label="Password" fullWidth type="password" />
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
