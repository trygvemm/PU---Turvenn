import { Box, Typography, TextField } from '@mui/material';
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import Radio from '@mui/material/Radio';
import TripCard from '../components/TripCard';
import { getTrips, reset, searchTrip } from '../features/trips/tripSlice';
import Spinner from '../components/Spinner';

function Home() {
  const { trips, isSuccess, isLoading, isError, message } = useSelector((state) => state.trips);
  const [formData, setFormData] = useState({
    searchWord: '',
    dateStart: '',
    dateEnd: ''
  });
  const { searchWord, dateStart, dateEnd } = formData;

  const [selectedValue, setSelectedValue] = useState('b');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    dispatch(getTrips());
  }, [dispatch, isError]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(selectedValue);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const searchData = { searchWord, dateStart, dateEnd };
    dispatch(searchTrip(searchData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Typography sx={{ width: '100%', margin: '20px' }} align="center" variant="h2">
        Hjem
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <form style={{ display: 'flex', alignItems: 'center', width: '50%' }} onSubmit={onSubmit}>
            <TextField
              id="searchWord"
              label="Søkefelt"
              placeholder="Søk etter turer"
              fullWidth
              value={searchWord}
              margin="normal"
              onChange={onChange}
              sx={{ width: '90%', height: '60px', marginRight: '10px' }}
            />
            <Button
              color="primary"
              aria-label="search"
              component="span"
              variant="outlined"
              onClick={onSubmit}
              sx={{ width: '10%', height: '60px' }}
            >
              <SearchIcon />
            </Button>
          </form>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
          <TextField
            id="dateStart"
            label="Dato og tid fra"
            type="datetime-local"
            fullWidth
            value={dateStart}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            sx={{ width: '50%', marginRight: '20px' }}
            onChange={onChange}
          />
          <TextField
            id="dateEnd"
            label="Dato og tid til"
            type="datetime-local"
            fullWidth
            value={dateEnd}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            sx={{ width: '50%' }}
            onChange={onChange}
          />
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}
        >
          <Typography sx={{ marginRight: '20px' }}>Sorter på rangering</Typography>
          <Typography>På</Typography>
          <Radio
            checked={selectedValue === 'a'}
            onChange={handleChange}
            value="a"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'A' }}
          />
          <Typography>Av</Typography>
          <Radio
            checked={selectedValue === 'b'}
            onChange={handleChange}
            value="b"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'B' }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px'
        }}
      >
        {selectedValue === 'b'
          ? [...trips]
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .reverse()
              .map((item) => (
                <div key={item.id}>
                  <Typography sx={{ display: 'inline' }} variant="p">
                    <b>
                      {item.user.firstName}&nbsp;
                      {item.user.role === 'commercial' && (
                        <Tooltip title="Commercial" arrow>
                          <VerifiedIcon style={{ fontSize: '15px', verticalAlign: 'middle' }} />
                        </Tooltip>
                      )}
                    </b>{' '}
                    publiserte en ny tur
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', fontSize: 12, color: '#b5b5b5', marginLeft: '5px' }}
                    variant="p"
                  >
                    <Moment format="Do MMMM YYYY, HH:mm">{item.createdAt}</Moment>
                  </Typography>
                  <TripCard
                    id={item.id}
                    title={item.name}
                    difficulty={item.difficulty}
                    date={item.startDate}
                    key={item.id}
                    rating={item.averageRating}
                  />
                </div>
              ))
          : [...trips]
              .sort((a, b) => a.averageRating - b.averageRating)
              .reverse()
              .map((item) => (
                <div key={item.id}>
                  <Typography sx={{ display: 'inline' }} variant="p">
                    <b>
                      {item.user.firstName}&nbsp;
                      {item.user.role === 'commercial' && (
                        <Tooltip title="Commercial" arrow>
                          <VerifiedIcon style={{ fontSize: '15px', verticalAlign: 'middle' }} />
                        </Tooltip>
                      )}
                    </b>{' '}
                    publiserte en ny tur
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', fontSize: 12, color: '#b5b5b5', marginLeft: '5px' }}
                    variant="p"
                  >
                    <Moment format="Do MMMM YYYY, HH:mm">{item.createdAt}</Moment>
                  </Typography>
                  <TripCard
                    id={item.id}
                    title={item.name}
                    difficulty={item.difficulty}
                    date={item.startDate}
                    key={item.id}
                    rating={item.averageRating}
                  />
                </div>
              ))}
      </Box>
    </Box>
  );
}

export default Home;
