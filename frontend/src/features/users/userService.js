import axios from 'axios';

const baseUrl = '/api/users';

const getUsers = async () => {
  const res = await axios.get(`${baseUrl}`);

  return res.data;
};

const getUser = async (userId) => {
  const res = await axios.get(`${baseUrl}/${userId}`);

  return res.data;
};

const changeRoleAdmin = async (userId, role, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const res = await axios.put(`${baseUrl}/${userId}/role`, { role }, config);

  return res.data;
};

const editProfile = async (userData, token) => {
  const formData = new FormData();
  const { id, firstName, lastName, email, experience, profilePic } = userData;
  if (profilePic === null || profilePic instanceof File) {
    formData.append('image', profilePic);
  }
  formData.append('id', id);
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('email', email);
  formData.append('experience', experience);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data; charset=utf8'
    }
  };

  const res = await axios.put(`${baseUrl}/edit`, formData, config);

  return res.data;
};

const userService = { getUsers, getUser, changeRoleAdmin, editProfile };

export default userService;
