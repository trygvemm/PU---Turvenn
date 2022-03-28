const compare = (password, hashedPassword) => password === hashedPassword;
const genSalt = (number) => 'test';
const hash = (password, salt) => password;

module.exports = {
  compare,
  genSalt,
  hash
};
