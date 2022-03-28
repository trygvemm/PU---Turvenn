import axios from 'axios';

const baseUrl = '/api/trips';

const getTrips = async () => {
  const res = await axios.get(baseUrl);

  return res.data;
};

const getTrip = async (tripId) => {
  const res = await axios.get(`${baseUrl}/${tripId}`);

  return res.data;
};

const getUserTrips = async (userId) => {
  const res = await axios.get(`/api/users/${userId}/trips`);

  return res.data;
};

const getTripsParticipatedIn = async (userId) => {
  const res = await axios.get(`/api/users/${userId}/participations`);

  return res.data;
};

const createTrip = async (tripData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.post(baseUrl, tripData, config);

  return res.data;
};

const signUp = async (tripId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.post(`${baseUrl}/${tripId}/signup`, {}, config);

  return res.data;
};

const signOff = async (tripId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.delete(`${baseUrl}/${tripId}/signup`, config);

  return res.data;
};

const editTrip = async (tripData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.post(`${baseUrl}/${tripData.id}/update`, tripData, config);

  return res.data;
};

const deleteTrip = async (tripId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.delete(`${baseUrl}/${tripId}`, config);

  return res.data;
};

const searchTrip = async (searchData) => {
  const res = await axios.get(
    `${baseUrl}/search?searchWord=${searchData.searchWord}&dateStart=${searchData.dateStart}&dateEnd=${searchData.dateEnd}`
  );

  return res.data;
};

const tripService = {
  getTrips,
  getTrip,
  getUserTrips,
  createTrip,
  signUp,
  signOff,
  editTrip,
  deleteTrip,
  searchTrip,
  getTripsParticipatedIn
};

export default tripService;
