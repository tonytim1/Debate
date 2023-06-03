import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import basestyle from "../../../BaseStyle.module.css";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loginError, setLoginError] = useState({});
  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [user_uid, setUserUid] = useState();

  // function timeout(delay: number) {
  //   return new Promise( res => setTimeout(res, delay) );
  // }

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    validateUser(user);

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

      if (response.ok) {
        clearLoginErrorMes();
        const responseData = await response.json();
        setUserUid(responseData.userId);
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userId', responseData.userId);
        console.log(localStorage.getItem("token"));
        setIsSubmit(true);
        setFormErrors(validateForm(user));
      } else {
        setLoginErrorMes();
      }
    } catch (error) {
      setLoginErrorMes();
    }
  }

  const setLoginErrorMes = () => {
    const errors = {};
    errors.login = "User not found";
    setLoginError(errors);
  }

  const clearLoginErrorMes = () => {
    const errors = {};
    setLoginError(errors);
  }
  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
      setEmailErr(true);
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email address";
      setEmailErr(true);
    }
    else{
      setEmailErr(false);
    }

    if (!values.password) {
      setPassErr(true);
    } else {
      setPassErr(false);
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length == 0 && Object.keys(loginError).length == 0 && isSubmit) {
      const userURL = `/user/${user_uid}`;
      navigate('/');
    }
  }, [formErrors], [loginError]);

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" 
        label="Email address" 
        onChange={changeHandler} 
        value={user.email} 
        error={emailErr}
        helperText={emailErr ? formErrors.email : ''}/>
        <TextField
          name="password"
          label="Password"
          onChange={changeHandler}
          value={user.password}
          error={passErr}
          helperText={passErr ? 'Password is required' : ''}
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
      <Divider sx={{ my: 3 }} />
      <span className={basestyle.error}>{loginError.login}</span>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Login
        </LoadingButton>
      </div>
    </>
  );
}
