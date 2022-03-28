const { errorHandler } = require('../../middleware/errorHandler');

describe('Error Handler', () => {
  let req;
  let res;
  let err;
  beforeEach(() => {
    err = {
      message: 'error',
      stack: 'error'
    };
    req = jest.fn();
    res = {
      status: jest.fn().mockImplementation(() => res),
      json: jest.fn(),
      statusCode: null
    };
  });

  it('should set statusCode to 500 by default', () => {
    errorHandler(err, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: err.message,
      stack: err.stack
    });
  });

  it('should set status to specified value', () => {
    res.statusCode = 200;

    errorHandler(err, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: err.message,
      stack: err.stack
    });
  });
});
