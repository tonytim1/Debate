import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import UserForm from 'src/sections/register/UserForm';
import UserDetails from 'src/sections/register/UserDetails';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Sign Up </title>
      </Helmet>
        <Container>
        
            <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
              Sign Up
            </Typography>
            <UserForm />
            <UserDetails />
          </Container>
          <Divider sx={{ my: 3 }}/>
            <LoadingButton
              sx={{ display: 'block', margin: '0 auto' }}
              type="submit"
              size="large"
              variant="contained"
              onClick={() => {navigate('/dashboard/room')}}
            >
              Create Account
            </LoadingButton>


    </>
  );
}
