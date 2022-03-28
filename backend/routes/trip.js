const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authHandler');

const {
  getTrips,
  createTrip,
  getTrip,
  signUp,
  signOff,
  updateTrip,
  deleteTrip,
  searchTrip
} = require('../controllers/tripController');

const router = express.Router();

// Re-route into note router
const logRouter = require('./log');

const participationRouter = require('./participation');

router.get('/search', searchTrip);

router.use('/:tripId/participations', participationRouter);

router.use('/:tripId/logs', logRouter);

// GET /api/trips
router.get('/', getTrips);

// GET /api/trips/:tripId
router.get('/:tripId', getTrip);

// POST /api/trips
router.post('/', protect, createTrip);

// POST /api/trips/:tripId/signup
router.post('/:tripId/signup', protect, signUp);

// POST /api/trips/:tripId/update
router.post('/:tripId/update', protect, updateTrip);

// DELETE /api/trips/:tripId
router.delete('/:tripId', protect, deleteTrip);

// DELETE /api/trips/:tripId/signup
router.delete('/:tripId/signup', protect, signOff);

module.exports = router;
