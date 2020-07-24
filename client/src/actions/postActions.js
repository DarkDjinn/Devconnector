import axios from 'axios';
import {
	ADD_POST,
	GET_ERRORS,
	GET_POSTS,
	POST_LOADING,
	DELETE_POST,
	GET_POST,
	CLEAR_ERRORS
} from './types';

// Add post
export const addPost = postData => async dispatch => {
	dispatch(clearErrors());
	try {
		const res = await axios.post('/api/posts', postData);
		dispatch({
			type: ADD_POST,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Add comment
export const addComment = (postId, commentData) => async dispatch => {
	dispatch(clearErrors());
	try {
		const res = await axios.post(`/api/posts/comment/${postId}`, commentData);
		dispatch({
			type: GET_POST,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		const res = await axios.delete(`/api/posts/${postId}/comment/${commentId}`);
		dispatch({
			type: GET_POST,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Get all posts
export const getPosts = () => async dispatch => {
	dispatch(setPostLoading());
	try {
		const res = await axios.get('/api/posts');
		dispatch({
			type: GET_POSTS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_POSTS,
			payload: null
		});
	}
};

// Get post
export const getPost = id => async dispatch => {
	dispatch(setPostLoading());
	try {
		const res = await axios.get(`/api/posts/${id}`);
		dispatch({
			type: GET_POST,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_POST,
			payload: null
		});
	}
};

// Delete post
export const deletePost = id => async dispatch => {
	try {
		await axios.delete(`/api/posts/${id}`);
		dispatch({
			type: DELETE_POST,
			payload: id
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Add Like
export const addLike = id => async dispatch => {
	try {
		await axios.post(`/api/posts/like/${id}`);
		dispatch(getPosts());
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Remove Like
export const removeLike = id => async dispatch => {
	try {
		await axios.post(`/api/posts/unlike/${id}`);
		dispatch(getPosts());
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Set loading state
export const setPostLoading = () => {
	return {
		type: POST_LOADING
	};
};

// Clear errors
export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS
	};
};
