import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Link, Card, IconButton, Fade, Button, InputAdornment, Alert, AlertTitle, TextField, Typography, Divider, Collapse } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from 'src/components/iconify/Iconify';


const LoginCard = ({ showLoginReminder, onSignupClick}) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loginError, setLoginError] = useState({});
  const [emailMissing, setEmailMissing] = useState(false);
  const [passwordMissing, setPasswordMissing] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loginSignup, setLoginSignup] = useState(true);
  const [user_uid, setUserUid] = useState();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (validateForm(user)){
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
  
    return (
      <div className="base-card">
        <div className="overlay-background" />
          <Card className='welcome-card' sx={{width:'90%'}}>
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
                <Link variant="subtitle2" onClick={onSignupClick}>Get started</Link>
              </Typography>

              <Stack spacing={2}>
                <TextField 
                  name="email" 
                  label={emailMissing ? "Email Is Missing" : "Email Address" }
                  error={emailMissing}
                  onChange={changeHandler} 
                  value={user.email}
                  />

                <TextField
                  name="password"
                  onChange={changeHandler}
                  value={user.password}
                  label={passwordMissing ? "Password Is Missing" : "Password" }
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
                      <LoadingButton sx={{width:'50%'}} size="large" type="submit" variant="contained" onClick={handleClick}>
                        Login
                      </LoadingButton>

                      <Button sx={{width:'25%'}} size="large" color="inherit" variant="outlined">
                        <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                      </Button>

                      <Button sx={{width:'25%'}} size="large" color="inherit" variant="outlined">
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