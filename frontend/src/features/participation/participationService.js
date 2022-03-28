import axios from 'axios';

const baseUrl = '/api/trips';

const getRatings = async (tripId) => {
  const res = await axios.get(`${baseUrl}/${tripId}/participations`);

  return res.data;
};

const getRating = async ({ tripId, userId }) => {
  const res = await axios.get(`${baseUrl}/${tripId}/participations/${userId}`);

  return res.data;
};

const changeRating = async ({ tripId, userId, rating }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const res = await axios.put(`${baseUrl}/${tripId}/participations/${userId}`, { rating }, config);

  return res.data;
};

const participationService = {
  getRatings,
  getRating,
  changeRating
};

export default participationService;
