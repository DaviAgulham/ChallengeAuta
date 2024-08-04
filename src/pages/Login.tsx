import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Typography, Container, Box, MenuItem, Select, InputLabel, FormControl, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { assignRole } from '../firestore/roles';
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  const { register, handleSubmit, control } = useForm();
  const auth = getAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await assignRole(userCredential.user.uid, data.role);
        setUser(userCredential.user);
        setRole(data.role);
        navigate(data.role === 'team' ? '/add-car' : '/');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const userRole = await getUserRole(userCredential.user.uid);
        setUser(userCredential.user);
        setRole(userRole);
        navigate(userRole === 'team' ? '/add-car' : '/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMsg = 'Error during authentication';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password';
      } else if (error.code === 'auth/user-not-found') {
        errorMsg = 'User not found';
      }
      setErrorMessage(errorMsg);
      setErrorOpen(true);
    }
  };

  const getUserRole = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.role;
    }
    return null;
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#fff'
        }}
      >
        <Typography variant="h4">{isSignUp ? "Sign Up" : "Login"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            {...register("email")}
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          {isSignUp && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue="consumer"
                render={({ field }) => (
                  <Select
                    labelId="role-label"
                    label="Role"
                    {...field}
                  >
                    <MenuItem value="consumer">Consumer</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </Button>
        </Box>
      </Box>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
