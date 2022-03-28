import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

const paperStyle = {
  padding: 20,
  width: 350,
  margin: '20px auto'
};
const inputStyle = { margin: '0px 0px 20px' };

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate('/home');
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = { email, password };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Paper
          elevation={10}
          style={paperStyle}
          sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
        >
          <h1 style={{ textAlign: 'center', width: '100%' }}>Logg inn</h1>

          <TextField
            required
            id="email"
            fullWidth
            label="Email"
            placeholder="Skriv inn Email"
            variant="outlined"
            value={email}
            onChange={onChange}
            style={inputStyle}
          />

          <TextField
            fullWidth
            required
            placeholder="Skriv inn passord"
            id="password"
            label="Passord"
            type="password"
            value={password}
            style={inputStyle}
            onChange={onChange}
          />

          <Button
            style={inputStyle}
            fullWidth
            variant="contained"
            id="onSubmit"
            color="success"
            onClick={onSubmit}
            disabled={!(email && password)}
          >
            Logg inn
          </Button>

          <Link to="/register">Ingen bruker? Registrer deg</Link>
        </Paper>
      </form>
    </div>
  );
}

export default Login;
