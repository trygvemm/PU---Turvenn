const moment = require('moment');
const { Trip, Participation } = require('../models');

const getRatings = async (req, res, next) => {
  const { tripId } = req.params;
  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Could not find trip.'));
  }

  try {
    const ratings = await trip.getParticipations({
      attributes: ['rating']
    });

    const filteredRatings = ratings.length ? ratings.filter((item) => item.rating) : [];
    const averageRating = filteredRatings.length
      ? filteredRatings.map((item) => item.rating).reduce((a, b) => a + b) / filteredRatings.length
      : null;

    return res.status(200).json({ ratings: filteredRatings, averageRating });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const getRating = async (req, res, next) => {
  const { tripId, userId } = req.params;
  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(500);
    return next(new Error('Could not find trip'));
  }

  try {
    const participation = await Participation.findOne({
      where: { tripId, userId },
      attributes: ['rating']
    });

    if (!participation) {
      return res.status(200).json(null);
    }

    return res.status(200).json(participation);
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const changeRating = async (req, res, next) => {
  const today = moment().format();
  const { tripId } = req.params;
  const { rating } = req.body;
  const { id } = req.user;

  if (rating > 10 || rating < 1) {
    res.status(400);
    return next(new Error('Rating must be between 1 and 10'));
  }

  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Could not find trip'));
  }

  if (trip.endDate < today) {
    res.status(400);
    return next(new Error('Cannot give rating before trip is over'));
  }

  const participation = await Participation.findOne({
    where: {
      userId: id,
      tripId
    }
  });

  if (!participation) {
    res.status(404);
    return next(new Error('Could not find signed up user'));
  }
  try {
    await participation.update({ rating });
    return res.status(200).json(participation);
  } catch (error) {
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

module.exports = {
  getRatings,
  getRating,
  changeRating
};
