import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser, editProfile, reset } from '../features/users/userSlice';

import './Register.css';
import Spinner from '../components/Spinner';

function ProfilePage() {
  // Burde hente fra en userSlice i redux med alle brukere, men dette fungerer foreløpig
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    experience: 1
  });

  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  const { firstName, lastName, email, experience } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { user, isLoading, isError, isSuccess, message, status } = useSelector(
    (state) => state.users
  );

  const inputStyle = { margin: '0px 0px 20px' };

  useEffect(() => {
    if (user && loggedInUser && user.id !== loggedInUser.id) {
      toast.error('Du kan bare redigere din egen bruker');
      navigate('/home');
    }
  }, [user, loggedInUser]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      if (status === 'updated') {
        toast.success('Oppdatert');
        navigate(`/users/${id}`);
      }
    }
  }, [dispatch, isSuccess, status]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      if (status === '') {
        navigate('/notfound');
      }
      dispatch(reset());
      return;
    }

    dispatch(getUser(id));
  }, [dispatch, isError, navigate, message, id, status]);

  useEffect(() => {
    if (user) {
      setFormData(() => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        experience: user.experience || 1
      }));
      setImage((user.profilePic && `http://localhost:4000/uploads/${user.profilePic}`) || {});
      setSelectedImage(
        (user.profilePic && `http://localhost:4000/uploads/${user.profilePic}`) || ''
      );
    }
  }, [user]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const onChangeExperience = (e) => {
    setFormData((prevState) => ({ ...prevState, experience: e.target.value }));
  };

  const onChangePic = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = { id: user.id, email, firstName, lastName, experience, profilePic: image };

    dispatch(editProfile(userData));
  };

  if (!user || isLoading) return <Spinner />;

  return (
    <Box
      sx={{
        width: '350px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
      }}
    >
      <Box id="profile-pic-container" sx={{ position: 'relative' }}>
        <Avatar
          sx={{
            width: 150,
            height: 150,
            marginTop: '30px',
            marginBottom: '30px'
          }}
          className="profile-pic-image"
          alt="En kul tur med gode venner"
          src={selectedImage || '../../assets/Turvenn-2.png'}
        />
        <Button
          sx={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '10%'
          }}
          className="change-pic-btn"
          fullWidth
          component="label"
        >
          <AddPhotoAlternateIcon />
          <input id="imageInput" type="file" onChange={onChangePic} hidden accept="image/*" />
        </Button>
      </Box>
      <form onSubmit={onSubmit}>
        <TextField
          required
          label="Fornavn"
          placeholder="Skriv inn fornavn"
          onChange={onChange}
          fullWidth
          id="firstName"
          value={firstName}
          style={inputStyle}
          error={!firstName}
        />
        <TextField
          required
          id="lastName"
          fullWidth
          label="Etternavn"
          placeholder="Skriv inn etternavn"
          variant="outlined"
          value={lastName}
          onChange={onChange}
          style={inputStyle}
          error={!lastName}
        />
        <TextField
          required
          label="Epost"
          type="email"
          placeholder="Skriv inn epost"
          onChange={onChange}
          value={email}
          fullWidth
          id="email"
          style={inputStyle}
          error={!email}
        />
        <Box className="experienceBox">
          <FormControl fullWidth>
            <InputLabel id="experience-label">Erfaringsnivå</InputLabel>
            <Select
              labelId="experience-label"
              id="experience-select"
              value={experience}
              label="Erfaringsnivå"
              onChange={onChangeExperience}
            >
              <MenuItem value={1}>Nybegynner</MenuItem>
              <MenuItem value={2}>Erfaren</MenuItem>
              <MenuItem value={3}>Ekspert</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          style={{ marginTop: '20px' }}
          type="submit"
          variant="contained"
          fullWidth
          color="success"
          onClick={onSubmit}
          disabled={!(firstName && lastName && email && experience)}
        >
          Oppdater
        </Button>
      </form>
    </Box>
  );
}

export default ProfilePage;
