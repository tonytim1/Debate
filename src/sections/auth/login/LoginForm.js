import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import basestyle from "../../../BaseStyle.module.css";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import firebase from "src/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";



// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { firestore, auth } = firebase;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  



  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    let flag = 0;
    if (!values.email) {
      errors.email = "Email is required";
      flag = 1;
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email address";
      flag = 1;
    }
    if (!values.password) {
      errors.password = "Password is required";
      flag = 1;
    }
    if (flag == 0){
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // User login successful
        const user = userCredential.user
      }).catch((error) => {
        console.error(error);
        // ..
      });
    }
    else{
      errors.login = "User not found"
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      navigate('/dashboard/profile', { replace: true });
    }
  }, [formErrors]);

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={changeHandler} value={user.email} />
        <span className={basestyle.error}>{formErrors.email}</span>

        <TextField
          name="password"
          label="Password"
          onChange={changeHandler}
          value={user.password}
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
        <p className={basestyle.error}>{formErrors.password}</p>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <span className={basestyle.error}>{formErrors.login}</span>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
