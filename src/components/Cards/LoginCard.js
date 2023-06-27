import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Link, Card, IconButton, Fade, Snackbar, Button, InputAdornment, Alert, AlertTitle, TextField, Typography, Divider, Collapse } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from 'src/components/iconify/Iconify';
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import LoadingScreen from 'src/components/Room/LoadingScreen';

const LoginCard = ({ showLoginReminder, onSignupClick }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loginError, setLoginError] = useState({});
  const [emailMissing, setEmailMissing] = useState(false);
  const [passwordMissing, setPasswordMissing] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loginSignup, setLoginSignup] = useState(true);
  const [user_uid, setUserUid] = useState();
  const [config, setConfig] = useState();

  const [errorAlertOpen, setErrorAlertOpen] = useState(false); // State to control the visibility of the error alert


  const handleAlertClose = () => {
    setErrorAlertOpen(false);
  };


  useEffect(() => {
    const getAuth = async () => {
      try {
        const response = await axios.get('http://' + window.location.hostname + ':8000/api/get_auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setConfig(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    getAuth();
  }, []);

  const signInWithGoogle = () => {
    const app = initializeApp(config, "secondary");
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        result.user.getIdToken().then(async (idToken) => {
          const user = {
            token: idToken,
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          };
          setUserUid(user.userId);
          localStorage.setItem('token', user.token);
          localStorage.setItem('userId', user.displayName);

          const cred = GoogleAuthProvider.credentialFromResult(result);
          const token = cred.accessToken;
          localStorage.setItem('photoURL', user.photoURL + "?height=500&access_token=" + token);

          sessionStorage.setItem('loggedIn', 'true');
          setLoginFailed(false);
          window.location.reload();
        });
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setLoginFailed(true);
          //setErrorAlertOpen(true);
        } else {
          // Other errors
          console.log("Error:", error);
        }
      });
  };

  const signInWithFacebook = () => {
    const app = initializeApp(config, "secondary");
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        result.user.getIdToken().then(async (idToken) => {
          const user = {
            token: idToken,
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          };
          setUserUid(user.userId);
          localStorage.setItem('token', user.token);
          localStorage.setItem('userId', user.displayName);

          const cred = FacebookAuthProvider.credentialFromResult(result);
          const token = cred.accessToken;
          localStorage.setItem('photoURL', user.photoURL + "?height=500&access_token=" + token);

          sessionStorage.setItem('loggedIn', 'true');
          setLoginFailed(false);
          window.location.reload();
        });
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setLoginFailed(true);
          //setErrorAlertOpen(true);
        } else {
          // Other errors
          console.log("Error:", error);
        }
      });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (validateForm(user)) {
      validateUser(user);
    }
  };

  const validateUser = async (user) => {
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
      console.log(response);
      if (response.ok) {
        // clearLoginErrorMes();
        setLoginFailed(false)
        const responseData = await response.json();
        setUserUid(responseData.userId);
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userId', responseData.userId);
        // console.log(localStorage.getItem("token"));
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

  // const setLoginErrorMes = () =>{
  //   const errors = {};
  //   errors.login = "User not found";
  //   setLoginError(errors);
  // }

  // const clearLoginErrorMes = () =>{
  //   const errors = {};
  //   setLoginError(errors);
  // }

  const validateForm = (values) => {
    const email_err = !values.email
    const pass_err = !values.password

    setEmailMissing(email_err);
    setPasswordMissing(pass_err)

    return !(email_err || pass_err)
  };

  // useEffect(() => {
  //   if (Object.keys(formErrors).length == 0 && Object.keys(loginError).length == 0 && isSubmit) {
  //     const userURL = `/user/${user_uid}`;
  //     navigate('/');
  //   }
  // }, [formErrors], [loginError]);

  if (!showLoginReminder) {
    return null; // Return null if the prop is false, hiding the component
  }
  if (loading) {
    return (
      <LoadingScreen />
    );
  }


  return (
    <div className="base-card">
      <div className="overlay-background" />
      <Card className='welcome-card' sx={{ width: '90%' }}>

        <Stack spacing={4} alignItems="center">
          <Stack spacing={1}>
            {/* <Snackbar open={errorAlertOpen ? true : false} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert onClose={handleAlertClose} severity="error">
                The email is already registered with a different account.
              </Alert>
            </Snackbar> */}
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
              <Link variant="subtitle2" onClick={onSignupClick}>Get started</Link>
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

              <Button sx={{ width: '25%' }} size="large" color="inherit" variant="outlined" onClick={signInWithGoogle}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button sx={{ width: '25%' }} size="large" color="inherit" variant="outlined" onClick={signInWithFacebook}>
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