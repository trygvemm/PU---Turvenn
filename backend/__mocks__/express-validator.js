const validationResult = (req) => {
  const res = {
    value: 'notempty',
    isEmpty: () => true
  };

  return res;
};

module.exports = {
  validationResult
};
