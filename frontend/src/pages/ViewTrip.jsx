/* eslint-disable no-template-curly-in-string */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  styled,
  Divider,
  Chip,
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  IconButton,
  LinearProgress
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CancelIcon from '@mui/icons-material/Cancel';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import Fab from '@mui/material/Fab';
import Rating from '@mui/material/Rating';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PublishIcon from '@mui/icons-material/Publish';
import useSignedUpStatus from '../hooks/useSignedUpStatus';
import { getTrip, reset, signUp, signOff, deleteTrip } from '../features/trips/tripSlice';
import { getLogs, createLog, reset as logReset } from '../features/logs/logSlice';
import {
  getRatings,
  getRating,
  changeRating,
  reset as participationReset
} from '../features/participation/participationSlice';

import Spinner from '../components/Spinner';
import ProfileCard from '../components/ProfileCard';
import LogCard from '../components/LogCard';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
});

function ViewTrip() {
  const today = moment().format();
  const paperStyle = { padding: 20, maxWidth: 900, margin: '20px auto' };
  const [image, setImage] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [formData, setFormData] = useState({
    text: ''
  });
  const { text } = formData;

  const [signedUp, setSignedUp] = useSignedUpStatus()[0];
  const [checkingStatus] = useSignedUpStatus()[1];

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { trip, isError, message, isLoading, isSuccess, status } = useSelector(
    (state) => state.trips
  );
  const {
    logs,
    isError: logsIsError,
    isLoading: logsIsLoading,
    isSuccess: logsIsSuccess
  } = useSelector((state) => state.logs);
  const { user } = useSelector((state) => state.auth);
  const {
    participation,
    participations,
    isLoading: participationIsLoading,
    isSuccess: participationIsSuccess,
    isError: participationIsError
  } = useSelector((state) => state.participations);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
      if (status === '') navigate('/notfound');
      dispatch(reset());
      dispatch(logReset());
      dispatch(participationReset());
      return;
    }
    if (logsIsError || participationIsError) {
      toast.error('Noe gikk galt');
      dispatch(reset());
      dispatch(logReset());
      dispatch(participationReset());
      navigate('/home');
      return;
    }

    dispatch(getTrip(id));
    dispatch(getLogs(id));
    dispatch(getRatings(id));
  }, [isError, message, id, logsIsError, participationIsError]);

  useEffect(async () => {
    if (user && signedUp && !checkingStatus) {
      dispatch(getRating({ tripId: id, userId: user.id }));
    }
  }, [signedUp, checkingStatus, id, user]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      if (status === 'deleted') {
        toast.info('Turen ble slettet');
        navigate('/home');
      }
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (participationIsSuccess) {
      dispatch(participationReset());
    }
  }, [dispatch, participationIsSuccess]);

  useEffect(() => {
    if (logsIsSuccess) {
      dispatch(logReset());
    }
  }, [dispatch, logsIsSuccess]);

  const onSignUp = async () => {
    await Promise.resolve(dispatch(signUp(trip.id)));
    setSignedUp(true);
  };

  const onSignOff = async () => {
    await Promise.resolve(dispatch(signOff(trip.id)));
    setSignedUp(false);
  };

  const onDelete = () => {
    dispatch(deleteTrip(trip.id));
  };

  const onChangeLog = (e) => {
    setFormData((prevState) => ({ ...prevState, text: e.target.value }));
  };

  const onChangePic = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGoTripCreator = () => {
    navigate(`/users/${trip.user.id}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const logData = { text, image: image, tripId: id };

    dispatch(createLog(logData));
    setFormData({ text: '' });
    setImage({});
    setSelectedImage('');
  };

  const onSubmitRating = async (e) => {
    e.preventDefault();
    const r = e.target.value;
    const participationData = { tripId: id, userId: trip.user.id, rating: r * 2 };
    await Promise.resolve(dispatch(changeRating(participationData)));
    dispatch(getRatings(id));
  };

  if (isLoading || checkingStatus || !trip) {
    return <Spinner />;
  }

  return (
    <main>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid container alignItems="flex-start" justifyContent="space-between">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                flexWrap: 'wrap'
              }}
            >
              <Avatar
                sx={{ height: 150, width: 150, marginRight: '10px', marginBottom: '10px' }}
                alt="logo"
                src="../Turvenn-logo.png"
              />
              <Typography variant="h4" component="h4" sx={{ textAlign: 'left', flex: 3 }}>
                {trip.name}
              </Typography>
              {trip.endDate < today && (
                <Grid sx={{ marginTop: '10px' }}>
                  <Stack>
                    {signedUp && (
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      <>
                        <Typography variant="h6" component="h6">
                          Din vurdering
                        </Typography>
                        {participationIsLoading ? (
                          <LinearProgress color="secondary" sx={{ height: '10px' }} />
                        ) : (
                          <Rating
                            name="half-rating"
                            defaultValue={0}
                            value={
                              participation && participation.rating ? participation.rating / 2 : 0
                            }
                            precision={0.5}
                            onChange={onSubmitRating}
                            sx={{ height: '10px' }}
                          />
                        )}
                      </>
                    )}
                    <Box>
                      <Typography variant="h6" component="h6" sx={{ marginTop: '10px' }}>
                        Gjennomsnittlig vurdering
                      </Typography>

                      {!participationIsLoading && participations && participations.ratings ? (
                        <Typography variant="body1" component="h2" sx={{ height: '10px' }}>
                          {participations.averageRating / 2} ({participations.ratings.length}{' '}
                          {participations.ratings.length === 1 ? 'vurdering' : 'vurderinger'})
                        </Typography>
                      ) : (
                        <LinearProgress sx={{ height: '10px' }} />
                      )}
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Box>
          </Grid>
          {user && (trip.user.id === user.id || user.role === 'admin') && (
            <Grid sx={{ ml: 3, mb: 2, mt: 3 }}>
              <Fab
                sx={{ mr: 2 }}
                size="small"
                color="secondary"
                aria-label="delete"
                onClick={() => navigate(`/trips/${id}/edit`)}
              >
                <EditIcon />
              </Fab>
              <Fab size="small" color="primary" aria-label="edit" onClick={handleOpen}>
                <DeleteIcon />
              </Fab>
            </Grid>
          )}
          {trip.startDate > today && (
            <Grid align="left" sx={{ mb: '10px' }}>
              {!signedUp ? (
                <Button onClick={onSignUp} variant="outlined" startIcon={<GroupAddOutlinedIcon />}>
                  Meld deg på
                </Button>
              ) : (
                <Button onClick={onSignOff} variant="contained" startIcon={<GroupAddIcon />}>
                  Meld deg av
                </Button>
              )}
            </Grid>
          )}
          <Grid container>
            <Paper elevation={3} style={paperStyle} sx={{ width: '320px' }}>
              <Typography variant="h5" component="h5">
                Hvor?
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Startpunkt
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {trip.start}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Mål
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {trip.goal}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={3} style={paperStyle} sx={{ width: '320px' }}>
              <Typography variant="h5" component="h5">
                Når?
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Fra
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {moment(trip.startDate).format('yyyy-MM-DD HH:mm')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Til
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {moment(trip.endDate).format('yyyy-MM-DD HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={3} style={paperStyle} sx={{ width: '320px' }}>
              <Typography variant="h5" component="h5">
                Om turen
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Vanskelighetsgrad
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {trip.difficulty}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h6">
                    Type
                  </Typography>
                  <Typography variant="body1" component="h2">
                    {trip.type}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Paper
              elevation={3}
              style={paperStyle}
              sx={{ width: '320px', cursor: 'pointer' }}
              onClick={handleGoTripCreator}
            >
              <Typography variant="h5" component="h5">
                Turansvarlig
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Avatar
                      sx={{ height: 50, width: 50, float: 'left', marginRight: '10px' }}
                      alt="profilbilde"
                      src={
                        (trip.user.profilePic &&
                          `http://localhost:4000/uploads/${trip.user.profilePic}`) ||
                        '../assets/Turvenn-2.png'
                      }
                    />
                    <Box sx={{ display: 'inline' }}>
                      <Typography variant="h6" component="h6">
                        {trip.user.firstName} {trip.user.lastName}{' '}
                        {trip.user.role === 'commercial' && (
                          <Tooltip title="Commercial" arrow>
                            <VerifiedIcon style={{ fontSize: '15px', verticalAlign: 'middle' }} />
                          </Tooltip>
                        )}
                      </Typography>
                      <Typography variant="body1" component="h2">
                        {trip.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Typography variant="h6" component="h6">
            Beskrivelse
          </Typography>
          <Typography variant="body1" component="h2">
            {trip.description}
          </Typography>
          <Grid
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            sx={{ mt: '1rem', mb: '0.5rem' }}
          >
            <Divider sx={{ width: '100%' }}>
              <Chip label="Innlegg" />
            </Divider>

            <Paper
              sx={{ mt: '1rem', mb: '1rem' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <Grid
                container
                spacing={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '20px',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '10%'
                  }}
                >
                  <Avatar size="medium">
                    <AccountCircleIcon />
                  </Avatar>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80%'
                  }}
                >
                  <TextField
                    id="text"
                    label="Innlegg"
                    placeholder="Hvordan gikk turen?"
                    multiline
                    fullWidth
                    size="small"
                    value={text}
                    onChange={onChangeLog}
                    sx={{ marginRight: '10px' }}
                  />
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '10%'
                  }}
                >
                  <Button
                    id="imgurl"
                    variant="contained"
                    component="label"
                    size="large"
                    margin="normal"
                  >
                    <AddPhotoAlternateIcon />
                    <input
                      id="imageInput"
                      type="file"
                      onChange={onChangePic}
                      hidden
                      accept="image/*"
                    />
                  </Button>
                </Grid>
                {selectedImage && (
                  <Paper
                    sx={{
                      width: '100%',
                      padding: '20px',
                      borderRadius: '10px',
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                    elevation={4}
                  >
                    <IconButton
                      component="span"
                      sx={{
                        zIndex: '10',
                        position: 'absolute'
                      }}
                      onClick={() => {
                        setImage({});
                        setSelectedImage('');
                        document.getElementById('imageInput').value = '';
                      }}
                    >
                      <CancelIcon
                        color="primary"
                        fontSize="large"
                        sx={{ backgroundColor: 'black', opacity: '0.9', borderRadius: '50%' }}
                      />
                    </IconButton>
                    <Img
                      src={selectedImage}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '500px',
                        objectFit: 'scale-down',
                        borderRadius: '10px'
                      }}
                    />
                  </Paper>
                )}

                <Grid
                  item
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    onClick={onSubmit}
                    className="btn btn-success"
                    type="submit"
                    variant="contained"
                    endIcon={<PublishIcon />}
                    disabled={!text}
                  >
                    Publiser innlegg
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Box
              id="logCardContainer"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
                justifyContant: 'center',
                alignItems: 'center'
              }}
            >
              {logsIsLoading && <Spinner />}
              {[...logs]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .reverse()
                .map((item) => (
                  <LogCard
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    user={item.user}
                    imageUrl={item.imageUrl}
                    createdAt={item.createdAt}
                  />
                ))}
            </Box>

            <Divider sx={{ width: '100%' }}>
              <Chip label="Turgåere" />
            </Divider>
            <Box
              id="profileCardContainer"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {trip.participators && trip.participators.length > 0 ? (
                trip.participators.map((item) => (
                  <ProfileCard
                    id={item.id}
                    name={`${item.firstName} ${item.lastName}`}
                    role={item.role}
                    key={item.id}
                    experience={item.experience}
                    profilePic={item.profilePic}
                  />
                ))
              ) : (
                <p>Ingen deltakere enda</p>
              )}
            </Box>
          </Grid>
        </Paper>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Bekreft sletting</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Er du sikker på at du vil slette turen for godt?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nei</Button>
          <Button onClick={onDelete} autoFocus>
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
export default ViewTrip;
