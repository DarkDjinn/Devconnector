const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc  Tests users route
// @access  Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Users Works' });
});

// @route   POST api/users/register
// @desc  Register a user
// @access  Public
router.post('/register', async (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const user = await User.findOne({ email: req.body.email });
	if (user) {
		error.email = 'Email already exists!';
		return res.status(400).json(errors);
	}

	const avatar = gravatar.url(req.body.email, {
		s: '200', // Size
		r: 'pg', // Rating
		d: 'mm' // default
	});

	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		avatar,
		password: req.body.password
	});

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, async (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			try {
				const user = await newUser.save();
				res.json(user);
			} catch (e) {
				console.log(e);
			}
		});
	});
});

// @route   POST api/users/login
// @desc  Login a User / Returning JWT Token
// @access  Public
router.post('/login', async (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	// Find user by email
	const user = await User.findOne({ email });

	// Check for user
	if (!user) {
		errors.email = 'User not found!';
		return res.status(404).json(errors);
	}

	// Check password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		errors.password = 'Password incorrect!';
		return res.status(400).json(errors);
	}

	// User Matched
	const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

	// Sign Token
	jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
		res.json({
			success: true,
			token: 'Bearer ' + token
		});
	});
});

// @route   GET api/users/current
// @desc  Return current user
// @access  Private
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
	}
);

module.exports = router;
