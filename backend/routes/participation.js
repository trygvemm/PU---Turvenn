const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authHandler');

const router = express.Router({ mergeParams: true });

const { changeRating, getRating, getRatings } = require('../controllers/participationController');

router.put('/:userId', protect, changeRating);

router.get('/', getRatings);

router.get('/:userId', getRating);

module.exports = router;
