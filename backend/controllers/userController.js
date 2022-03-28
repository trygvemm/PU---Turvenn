const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'abc123';
  return jwt.sign({ id }, jwtSecret);
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'profilePic', 'experience']
    });
    return res.status(200).json(users);
  } catch (error) {
    res.status(500);
    return next(new Error('Something went wrong'));
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'experience', 'profilePic']
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
};

/**
 * @desc   Get current user
 * @route  /api/users/login
 * @access Private
 */
const getLogin = async (req, res, next) => {
  const user = {
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role,
    experience: req.user.experience
  };
  res.status(200).json(user);
};

const registerUser = async (req, res, next) => {
  const { email, firstName, lastName, password, isCommercial } = req.body;

  const errors = validationResult(req);

  // Validation
  if (!errors.isEmpty() || !firstName || !lastName || !email || !password) {
    res.status(400);
    return next(new Error('Validation failed for submitted data'));
  }

  if (await User.findOne({ where: { email } })) {
    res.status(400);
    return next(new Error('User already exists'));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = isCommercial ? 'commercial' : 'user';

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role
    });
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        accessToken: generateToken(newUser.id)
      }
    });
  } catch (error) {
    // Database couldn't save user
    res.status(400);
    next(new Error('Invalid user data'));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  // Match passwords
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      message: 'User login successfull',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accessToken: generateToken(user.id)
      }
    });
  }
  res.status(401);
  next(new Error('Invalid credentials'));
};

const changeRoleAdmin = async (req, res, next) => {
  if (req.user.email !== 'turvenn.turvenn@gmail.com') {
    res.status(403);
    return next(new Error('Not authorized to make admin'));
  }

  if (req.user.role === 'commercial') {
    res.status(403);
    return next(new Error('Cannot give admin privileges to commercial user'));
  }

  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    return next(new Error('User not found'));
  }

  if (user.email === 'turvenn.turvenn@gmail.com') {
    res.status(400);
    return next(new Error('Cannot remove admin priviliges of super admin'));
  }

  try {
    await user.update({ role });
    return res.status(200).json(user);
  } catch (error) {
    res.status(400);
    next(new Error('Invalid role'));
  }
};

const editUser = async (req, res, next) => {
  const { id, email, firstName, lastName, experience } = req.body;

  const user = {
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    experience: req.user.experience,
    profilePic: req.user.profilePic
  };

  if (+id !== +user.id) {
    res.status(403);
    return next(new Error('Cannot edit another user'));
  }

  if (user.email === 'turvenn.turvenn@gmail.com') {
    res.status(403);
    return next(new Error('Turvenn cannot be altered'));
  }

  if (!email || !firstName || !lastName || !experience) {
    res.status(400);
    return next(new Error('Bad request data'));
  }

  if (user.email !== email) {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(403);
      return next(new Error('Email is unavailable'));
    }
  }

  const profilePic = (req.file && req.file.filename) || user.profilePic;

  try {
    const updatedUser = await req.user.update({
      email,
      firstName,
      lastName,
      experience,
      profilePic
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500);
    next(new Error('Something went wrong'));
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getLogin,
  getUser,
  changeRoleAdmin,
  editUser
};
