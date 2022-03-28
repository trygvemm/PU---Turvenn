const { User } = require('../../models');
const { protect } = require('../../middleware/authHandler');

describe('Auth Handler - protect', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
    req = {
      headers: {
        authorization: ''
      },
      user: null
    };
    res = {
      status: jest.fn().mockImplementation(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next with error and set status to 401 if no token is provided', async () => {
    await protect(req, res, next);

    expect(req.user).toBe(null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(new Error('Not authorized'));
  });

  it('should call next with error and set status to 401 if token is invalid', async () => {
    User.findByPk = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    req.headers.authorization = 'Bearer token';

    await protect(req, res, next);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(req.user).toBe(null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(new Error('Not authorized'));
  });

  it('should call next with no arguments if token is valid', async () => {
    User.findByPk = jest.fn().mockImplementationOnce(() => ({
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Snow'
    }));
    req.headers.authorization = 'Bearer token';

    await protect(req, res, next);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Snow'
    });
    expect(res.status).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
