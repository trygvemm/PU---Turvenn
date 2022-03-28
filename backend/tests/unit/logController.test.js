const { User, Trip, Log } = require('../../models');
const { createLog, getLogs } = require('../../controllers/logController');

describe('Log Controller - Create Log', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
    req = {
      body: {
        text: 'tekst'
      },
      user: {
        id: 1
      },
      params: {
        tripId: 1
      }
    };
    res = {
      status: jest.fn().mockImplementation(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return status 400 if text is empty', async () => {
    req.body.text = '';

    await createLog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return status 404 if trip is not found', async () => {
    Trip.findByPk = jest.fn().mockImplementation(() => null);

    await createLog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should return status 201 if created', async () => {
    Trip.findByPk = jest.fn().mockImplementation(() => ({
      id: 1
    }));

    Log.create = jest.fn().mockImplementation(() => ({
      id: 1
    }));

    await createLog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
