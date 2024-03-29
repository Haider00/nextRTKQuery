import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import {useGetUsersQuery} from "./api/usersapi";
import { useDispatch } from 'react-redux';
import { setUserEmail } from "./api/userSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const router = useRouter();

  const success = () =>
    toast.success("Woohoo! Login successful! 🎉", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  
    const failed = () => toast.error("Login failed. Please try again. 😞", {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });


// getting users-data from Api using RTK
  const {isLoading,isError, isSuccess, data,error}= useGetUsersQuery();
  const validateEmail = (inputEmail) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(inputEmail);
  };

  const handleLogin = () => {
    
    if (email.trim() === "" || !validateEmail(email)) {
      setEmailError(true);
      failed();
      return;
    }

    if (password.trim().length < 6) {
      setPasswordError(true);
      return;
    }
   
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (isError) {
      return <div>Error: {error.message}</div>;
    }
    
    if (isSuccess) {
      const userWithEmail = data.find((user) => user.email === email);
      if (!userWithEmail) {
        return toast.error("User with this email dose not exist")
      }
      else{
        const userExists = data.find((user) => user.password === password);
         if(userExists){ 
           dispatch(setUserEmail(email));
          setEmail(""); 
          setPassword("");
          setEmailError(false);
          setPasswordError(false);
          router.push("/notes");
          success();
         }
         else{
          toast.error("User with this email dosen't exist. 😞", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return <div>please enter correct password</div>;
         }
      }
     
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "97vh", background: 'linear-gradient(to right, #00d2ff, #928dab)', }}
    >
      <ToastContainer/>
      <Paper
        elevation={5}
        sx={{ padding: "20px", width: 500, textAlign: "center", border:"2px solid blue" }}
      >
        <Typography variant="h4">Welcome to My Application</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Enter your credentials to Login
        </Typography>
        <TextField
          required
          label="Email"
          variant="filled"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          error={emailError}
          helperText={emailError ? "Enter a valid email address" : ""}
        />
        <TextField
          required
          label="Password"
          type="password"
          variant="filled"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          error={passwordError}
          helperText={
            passwordError ? "Password must be at least 6 characters" : ""
          }
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogin}
          sx={{ marginTop: "20px", '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.04)',
          }, }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ marginTop: "10px" }}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
