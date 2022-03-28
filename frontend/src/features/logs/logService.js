import axios from 'axios';

const baseUrl = '/api/trips';

const getLogs = async (tripId) => {
  const res = await axios.get(`${baseUrl}/${tripId}/logs`);

  return res.data;
};

const createLog = async (logData, token) => {
  const formData = new FormData();
  const { tripId, image, text } = logData;
  formData.append('image', image);
  formData.append('tripId', tripId);
  formData.append('text', text);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data; charset=utf8'
    }
  };

  const res = await axios.post(`${baseUrl}/${logData.tripId}/logs`, formData, config);

  return res.data;
};

const tripService = {
  getLogs,
  createLog
};

export default tripService;
