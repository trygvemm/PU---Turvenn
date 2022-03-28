const sign = (payload, secret, options) => 'supersecrettoken';

const verify = (token, secret, options) => 1;

module.exports = {
  sign,
  verify
};
