import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { Divider, Chip, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TripCard from '../components/TripCard';
import { getUser, changeRoleAdmin, reset as userReset } from '../features/users/userSlice';
import {
  getTripsParticipatedIn,
  getUserTrips,
  reset as tripReset
} from '../features/trips/tripSlice';
import Username from '../components/Username';
import Spinner from '../components/Spinner';

function User() {
  const today = moment().format();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { user, isError, isLoading, message, isSuccess } = useSelector((state) => state.users);
  const {
    userTrips,
    userParticipatedIn,
    isLoading: tripsIsLoading,
    isSuccess: tripsIsSuccess
  } = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const futureTrips = userParticipatedIn.filter((item) => item.startDate > today);
  const pastTrips = userParticipatedIn.filter((item) => item.startDate <= today);

  useEffect(() => {
    if (isSuccess) {
      dispatch(userReset());
    }
    if (tripsIsSuccess) {
      dispatch(tripReset());
    }
  }, [dispatch, isSuccess, tripsIsSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/notfound');
      dispatch(userReset());
      dispatch(tripReset());
      return;
    }

    dispatch(getUser(id));
    dispatch(getUserTrips(id));
    dispatch(getTripsParticipatedIn(id));
  }, [isError, message, id]);
  const onAdmin = (role) => {
    const userData = {
      userId: id,
      role
    };
    dispatch(changeRoleAdmin(userData));
  };

  const renderExperience = () => {
    switch (user.experience) {
      case 1:
        return 'Nybegynner';
      case 2:
        return 'Erfaren';
      case 3:
        return 'Ekspert';
      default:
        return 'Erfaringsnivå';
    }
  };

  if (!user || isLoading || tripsIsLoading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <Avatar
          sx={{ width: 200, height: 200, marginTop: '40px' }}
          alt="En kul tur med gode venner"
          src={
            (user.profilePic && `http://localhost:4000/uploads/${user.profilePic}`) ||
            '../assets/Turvenn-2.png'
          }
        />
        <h1
          style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3px' }}
        >
          <Username user={user} />
        </h1>
        <Typography variant="p" component="p">
          {renderExperience()}
        </Typography>
        <p style={{ width: '100%', textAlign: 'center' }}>{user.email}</p>
        {loggedInUser && loggedInUser.id === user.id && user.email !== 'turvenn.turvenn@gmail.com' && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/users/${id}/edit`)}
            endIcon={<EditIcon />}
          >
            Rediger Profil
          </Button>
        )}
        {loggedInUser &&
          user.email !== 'turvenn.turvenn@gmail.com' &&
          loggedInUser.email === 'turvenn.turvenn@gmail.com' &&
          user.role !== 'commercial' && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {user.role !== 'admin' ? (
                <Button
                  onClick={() => onAdmin('admin')}
                  variant="outlined"
                  startIcon={<AdminPanelSettingsOutlinedIcon />}
                >
                  Gi adminrettigheter
                </Button>
              ) : (
                <Button
                  onClick={() => onAdmin('user')}
                  variant="contained"
                  startIcon={<AdminPanelSettingsIcon />}
                >
                  Fjern adminrettigheter
                </Button>
              )}
            </>
          )}
      </Box>
      {!!futureTrips.length && (
        <>
          <Divider sx={{ width: '100%' }}>
            <Chip label="Kommende turer" />
          </Divider>
          <Box
            id="tripComingContainer"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {futureTrips.map((item) => (
              <TripCard
                id={item.id}
                title={item.name}
                difficulty={item.difficulty}
                duration={item.duration}
                date={item.startDate}
                key={item.id}
                rating={item.averageRating}
              />
            ))}
          </Box>
        </>
      )}
      {!!pastTrips.length && (
        <>
          <Divider sx={{ width: '100%' }}>
            <Chip label="Turhistorikk" />
          </Divider>
          <Box
            id="tripHistoryContainer"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {pastTrips.map((item) => (
              <TripCard
                id={item.id}
                title={item.name}
                difficulty={item.difficulty}
                duration={item.duration}
                date={item.startDate}
                key={item.id}
                rating={item.averageRating}
              />
            ))}
          </Box>

          <div id="history" />
        </>
      )}
      {!!userTrips.length && (
        <>
          <Divider sx={{ width: '100%' }}>
            <Chip label="Dine turer" />
          </Divider>
          <Box
            id="yourTrips"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {userTrips.map((item) => (
              <TripCard
                id={item.id}
                title={item.name}
                difficulty={item.difficulty}
                duration={item.duration}
                date={item.startDate}
                key={item.id}
                rating={item.averageRating}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default User;
