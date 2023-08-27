import { useState, useEffect } from 'react';
import { Stack, Link, Card, IconButton, Button, InputAdornment, Alert, TextField, Typography, Collapse } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify/Iconify';
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../../src/index.js';
import LoadingScreen from 'src/components/Room/LoadingScreen';

const LoginCard = ({ showLoginReminder, onSignupClick, onLoginStageClick }) => {
  const [emailMissing, setEmailMissing] = useState(false);
  const [passwordMissing, setPasswordMissing] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false); // var for the login error alert
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  })


useEffect(() => {  setLoading(false);  } )
  
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const signInWithExternalPlatform = (platform_provider) => {
    signInWithPopup(auth, platform_provider)
      .then((result) => {
        result.user.getIdToken().then(async (idToken) => {
          const user = {
            token: idToken,
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            provider: result.user.providerData[0].providerId
          };

          localStorage.setItem('token', user.token);

          // set profilePhotoURL local variable
          let cred;
          if (user.provider === 'google') {
            cred = GoogleAuthProvider.credentialFromResult(result);
          } else {
            cred = FacebookAuthProvider.credentialFromResult(result);
          }
          
          
          const token = cred.accessToken;
          localStorage.setItem('profilePhotoURL', user.photoURL + "?height=500&access_token=" + token);

          // check if the first time this user connected to the app
          const response = await fetch('http://' + window.location.hostname + ':8000/api/check_user_data', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'UserId': user.userId
            }
          });

          const userDoc = await response.json();

          localStorage.setItem('provider', user.provider);
          setLoginFailed(false);

          if (userDoc != null) { // if not first time
            localStorage.setItem('userId', userDoc.username);
            localStorage.setItem('tags', userDoc.tags);
            localStorage.setItem('UserAuthenticated', 'true');

            sessionStorage.setItem('loggedIn', 'true'); // for the login success alert
            
            window.location.reload();
          }
          else{ // first time connected
            localStorage.setItem('userId', user.displayName);
            localStorage.setItem('UserAuthenticated', 'false');
            onLoginStageClick();
          }
        });
      })
      .catch((error) => {
        setLoginFailed(true);
        console.log("Error:", error);
      });
  };

  const signInRegular = async (user) => {
    try {
      //user details
      const loginUser = {
        email: user.email,
        password: user.password,
      };

      // Send the new user data to the backend server
      const response = await fetch('http://' + window.location.hostname + ':8000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginUser),
      });

      if (response.ok) {
        setLoginFailed(false);
        const responseData = await response.json();

        // local variables for continuous 
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userId', responseData.userId);
        localStorage.setItem('tags', responseData.tags);
        localStorage.setItem('profilePhotoURL', responseData.profilePhotoURL);
        localStorage.setItem('provider', 'password');
        localStorage.setItem('UserAuthenticated', 'true');
        sessionStorage.setItem('loggedIn', 'true'); // for the login success alert
        

        window.location.reload();


      }
      else {
        setLoginFailed(true);
      }
    }
    catch (error) {
      setLoginFailed(true);
    }
  };

  const validateForm = (values) => {
    const email_err = !values.email
    const pass_err = !values.password

    setEmailMissing(email_err);
    setPasswordMissing(pass_err)

    return !(email_err || pass_err)
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (validateForm(user)) {
      signInRegular(user);
    }
  };

  if (!showLoginReminder) {
    return null;
  }

  if (loading) {
    return (
      <LoadingScreen />
    );
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

        <Stack spacing={4} alignItems="center">
          <Stack spacing={1}>
            <Typography variant="h2">
              Welcome
            </Typography>
            <Typography variant="body1">
              Welcome to our video chat platform,
              where you can explore diverse perspectives,
              engage in meaningful conversations,
              and expand your horizons. <br />
              Connect face-to-face with individuals who hold different opinions,
              fostering personal growth and expanding your knowledge.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h4">
              Sign In
            </Typography>

            <Typography variant="body2">
              Don’t have an account? {''}
              <Link variant="subtitle2" onClick={onSignupClick} style={{ cursor: 'pointer' }}>Get started</Link>
            </Typography>

            <Stack spacing={2}>
              <TextField
                name="email"
                label={emailMissing ? "Email Is Missing" : "Email Address"}
                error={emailMissing}
                onChange={changeHandler}
                value={user.email}
              />

              <TextField
                name="password"
                onChange={changeHandler}
                value={user.password}
                label={passwordMissing ? "Password Is Missing" : "Password"}
                error={passwordMissing}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Collapse in={loginFailed}>
              <Alert severity="error">
                Login failed, check again your email and password
              </Alert>
            </Collapse>
            <Stack direction="row" spacing={2}>
              <LoadingButton sx={{ width: '50%' }} size="large" type="submit" variant="contained" onClick={handleClick}>
                Login
              </LoadingButton>

              <Button sx={{ width: '25%' }} size="large" color="inherit" variant="outlined" onClick={() => signInWithExternalPlatform(new GoogleAuthProvider())}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button sx={{ width: '25%' }} size="large" color="inherit" variant="outlined" onClick={() => signInWithExternalPlatform(new FacebookAuthProvider())}>
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default LoginCard;