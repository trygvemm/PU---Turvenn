const { Op } = require('@sequelize/core');
const moment = require('moment');
const { Trip, User, sequelize, Participation } = require('../models');

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      attributes: [
        'id',
        'name',
        'start',
        'goal',
        'startDate',
        'endDate',
        'difficulty',
        'type',
        'description',
        'createdAt',
        [sequelize.fn('AVG', sequelize.col('Participations.rating')), 'averageRating']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'experience', 'profilePic']
        },
        {
          model: Participation,
          attributes: []
        }
      ],
      group: ['Trip.id', 'user.id']
    });
    return res.status(200).json(trips);
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const getUserTrips = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    return next(new Error('User not found'));
  }

  try {
    const trips = await user.getTrips({
      attributes: [
        'id',
        'name',
        'start',
        'goal',
        'startDate',
        'endDate',
        'difficulty',
        'type',
        'description',
        [sequelize.fn('AVG', sequelize.col('Participations.rating')), 'averageRating']
      ],
      include: [
        {
          model: Participation,
          attributes: []
        }
      ],
      group: ['Trip.id']
    });

    return res.status(200).json(trips);
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

/**
 * Gets all trips that a user has partcipated in
 */
const getTripsByParticipator = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    return next(new Error('User not found'));
  }

  try {
    const trips = await Trip.findAll({
      attributes: [
        'id',
        'name',
        'start',
        'goal',
        'startDate',
        'endDate',
        'difficulty',
        'type',
        'description',
        [sequelize.fn('AVG', sequelize.col('Participations.rating')), 'averageRating']
      ],
      include: [
        {
          model: User,
          as: 'participators',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'experience', 'profilePic'],
          through: {
            attributes: []
          },
          where: {
            id: userId
          }
        },
        {
          model: Participation,
          attributes: []
        }
      ],
      group: ['Trip.id', 'participators.id']
    });

    return res.status(200).json(trips);
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const getTrip = async (req, res, next) => {
  const { tripId } = req.params;

  const trip = await Trip.findByPk(tripId, {
    attributes: [
      'id',
      'name',
      'start',
      'goal',
      'startDate',
      'endDate',
      'difficulty',
      'type',
      'description',
      'createdAt'
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'experience', 'profilePic']
      },
      {
        model: User,
        as: 'participators',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'experience', 'profilePic'],
        through: {
          attributes: []
        }
      }
    ]
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  return res.status(200).json(trip);
};

const createTrip = async (req, res, next) => {
  const { name, start, goal, startDate, endDate, difficulty, type, description } = req.body;
  const userId = req.user.id;

  try {
    const newTrip = await Trip.create({
      name,
      start,
      goal,
      startDate,
      endDate,
      difficulty,
      type,
      description,
      userId
    });
    return res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        name: newTrip.name,
        start: newTrip.start,
        goal: newTrip.goal,
        startDate: newTrip.endDate,
        endDate: newTrip.endDate,
        difficulty: newTrip.difficulty,
        type: newTrip.type,
        description: newTrip.description
      }
    });
  } catch (error) {
    res.status(400);
    next(new Error('Invalid trip data'));
  }
};

const signUp = async (req, res, next) => {
  const today = moment().format();
  const { tripId } = req.params;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }
  if (today > trip.startDate) {
    res.status(400);
    return next(new Error('Trip has already begun'));
  }

  if (trip)
    try {
      await user.addParticipatedTrip(trip);
      return res.status(201).json({ message: 'Successfully signed up' });
    } catch (error) {
      console.log(error);
      res.status(500);
      next(new Error('Something went wrong'));
    }
};

const signOff = async (req, res, next) => {
  const today = moment().format();
  const { tripId } = req.params;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }
  if (today > trip.startDate) {
    res.status(400);
    return next(new Error('Trip has already begun'));
  }

  try {
    await user.removeParticipatedTrip(trip);
    return res.status(200).json({ message: 'Successfully signed off' });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const deleteTrip = async (req, res, next) => {
  const { id, role } = req.user;
  const { tripId } = req.params;

  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  try {
    // TODO(Ola): gjøre så "groups" kan slette, ikke basert på brukerid for at admin kan også slette
    if (role !== 'admin' && trip.userId !== id)
      return res.status(403).json({ message: 'Unauthorized' });

    await trip.destroy();

    return res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const updateTrip = async (req, res, next) => {
  const { name, start, goal, startDate, endDate, difficulty, type, description } = req.body;
  const { id, role } = req.user;
  const { tripId } = req.params;

  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  try {
    // TODO(Ola): gjøre så "groups" kan slette, ikke basert på brukerid for at admin kan også slette
    if (role !== 'admin' && trip.userId !== id)
      return res.status(403).json({ message: 'Unauthorized' });

    trip.set({
      name: name,
      start: start,
      goal: goal,
      startDate: startDate,
      endDate: endDate,
      difficulty: difficulty,
      type: type,
      description: description
    });

    await trip.save();

    return res.status(200).json({ message: 'Trip updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

const searchTrip = async (req, res) => {
  let { searchWord, dateStart, dateEnd } = req.query;

  if (!dateStart) {
    dateStart = new Date(1, 1, 1);
  }

  if (!dateEnd) {
    dateEnd = new Date(3000, 1, 1);
  }

  if (!searchWord) {
    searchWord = '';
  }

  const trips = await Trip.findAll({
    where: {
      name: { [Op.iLike]: `%${searchWord}%` },
      startDate: { [Op.lte]: dateEnd, [Op.gte]: dateStart }
    },
    attributes: [
      'id',
      'name',
      'start',
      'goal',
      'startDate',
      'endDate',
      'difficulty',
      'type',
      'description',
      'createdAt',
      [sequelize.fn('AVG', sequelize.col('Participations.rating')), 'averageRating']
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'experience', 'profilePic']
      },
      {
        model: Participation,
        attributes: []
      }
    ],
    group: ['Trip.id', 'user.id']
  });
  return res.status(200).json(trips);
};

module.exports = {
  getTrips,
  createTrip,
  getUserTrips,
  getTrip,
  signUp,
  signOff,
  deleteTrip,
  updateTrip,
  searchTrip,
  getTripsByParticipator
};
