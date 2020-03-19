const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Posts Works' });
});

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', async (req, res) => {
	try {
		const posts = await Post.find({}).sort({ date: -1 });
		return res.json(posts);
	} catch (e) {
		res.status(404).json({ nopostsfound: 'No posts found!' });
	}
});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Public
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		return res.json(post);
	} catch (e) {
		res.status(404).json({ nopostfound: 'No post found with that ID!' });
	}
});

// @route   POST api/posts
// @desc    Create new post
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			// If any errors, send 400 with errors object
			return res.status(400).json(errors);
		}

		const newPost = await new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		}).save();

		res.json(newPost);
	}
);

// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const profile = Profile.findOne({ user: req.user.id });
			const post = await Post.findById(req.params.id);
			if (post.user.toString() !== req.user.id) {
				return res.status(401).json({ notauthorized: 'User not authorized!' });
			}
			await post.remove();
			res.json({ success: true });
		} catch (e) {
			res.status(404).json({ postnotfound: 'No post found!' });
		}
	}
);

// @route   POST api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const profile = Profile.findOne({ user: req.user.id });
			const post = await Post.findById(req.params.id);
			if (
				post.likes.filter(like => like.user.toString() === req.user.id).length >
				0
			) {
				return res
					.status(400)
					.json({ alreadyliked: 'User already liked this post!' });
			}
			// Add user id to likes array
			post.likes.unshift({ user: req.user.id });
			const newPost = post.save();
			res.json(post);
		} catch (e) {
			res.status(404).json({ postnotfound: 'No post found!' });
		}
	}
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike Post
// @access  Private
router.post(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const profile = Profile.findOne({ user: req.user.id });
			const post = await Post.findById(req.params.id);
			if (
				post.likes.filter(like => like.user.toString() === req.user.id)
					.length === 0
			) {
				return res
					.status(400)
					.json({ notliked: 'You have not yet liked this post!' });
			}
			// Get remove index
			const removeIndex = post.likes
				.map(like => like.user.toString())
				.indexOf(req.user.id);

			// Splice out of array
			post.likes.splice(removeIndex, 1);

			// Save
			const newLikes = await post.save();
			res.json(newLikes);
		} catch (e) {
			res.status(404).json({ postnotfound: 'No post found!' });
		}
	}
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
	'/comment/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		if (!isValid) {
			return res.status(400).json(errors);
		}

		try {
			const comment = {
				user: req.user.id,
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar
			};
			const post = await Post.findById(req.params.id);

			// Add to comments array
			post.comments.unshift(comment);
			await post.save();

			res.json(post);
		} catch (e) {
			res.status(404).json({ postnotfound: 'No post found!' });
		}
	}
);

// @route   DELETE api/posts/:post_id/comment/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
	'/:post_id/comment/:comment_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.post_id);
			const removeIndex = post.comments
				.map(item => item.id.toString())
				.indexOf(req.params.comment_id);
			if (removeIndex === -1) {
				return res
					.status(404)
					.json({ commentnotexists: 'Comment does not exist!' });
			}
			if (
				post.comments[removeIndex].user.toString() === req.user.id.toString()
			) {
				post.comments.splice(removeIndex, 1);
				await post.save();
				res.json(post);
			} else {
				res.json({ unauthorized: 'Unauthorized' });
			}
		} catch (e) {
			res.status(404).json({ postnotfound: 'Post not found!' });
		}
	}
);

module.exports = router;
