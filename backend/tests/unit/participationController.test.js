const moment = require('moment');
const { Trip, Participation } = require('../../models');
const {
  changeRating,
  getRating,
  getRatings
} = require('../../controllers/participationController');

describe('Participation Controller - Change Rating', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
    req = {
      body: {
        rating: 5
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

  it('should return status 200 if successful', async () => {
    Trip.findByPk = jest
      .fn()
      .mockImplementation(() => ({ id: 1, endDate: moment().add(1, 'days').format() }));
    Participation.findOne = jest
      .fn()
      .mockImplementation(() => ({ userId: 1, tripId: 1, update: () => {} }));

    await changeRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should set status to 400 if endDate is invalid', async () => {
    Trip.findByPk = jest
      .fn()
      .mockImplementation(() => ({ id: 1, endDate: moment().subtract(1, 'days').format() }));

    await changeRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
