import axios from 'axios';
import {
	GET_PROFILE,
	PROFILE_LOADING,
	CLEAR_CURRENT_PROFILE,
	GET_ERRORS,
	SET_CURRENT_USER,
	GET_PROFILES
} from './types';

// Get current Profile
export const getCurrentProfile = () => async dispatch => {
	dispatch(setProfileLoading());

	try {
		const res = await axios.get('/api/profile');
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_PROFILE,
			payload: {}
		});
	}
};

// Get all profiles
export const getProfiles = () => async dispatch => {
	dispatch(setProfileLoading());
	try {
		const res = await axios.get('/api/profile/all');
		dispatch({
			type: GET_PROFILES,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_PROFILES,
			payload: null
		});
	}
};

// Get profile by handle
export const getProfileByHandle = handle => async dispatch => {
	dispatch(setProfileLoading());

	try {
		const res = await axios.get(`/api/profile/handle/${handle}`);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_PROFILE,
			payload: null
		});
	}
};

// Create Profile
export const createProfile = (profileData, history) => async dispatch => {
	try {
		await axios.post('/api/profile', profileData);
		history.push('/dashboard');
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Add experience
export const addExperience = (expData, history) => async dispatch => {
	try {
		await axios.post('/api/profile/experience', expData);
		history.push('/dashboard');
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Add education
export const addEducation = (eduData, history) => async dispatch => {
	try {
		await axios.post('/api/profile/education', eduData);
		history.push('/dashboard');
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Delete Account & profile
export const deleteAccount = () => async dispatch => {
	try {
		if (window.confirm('Are you sure? This cannont be undone!')) {
			await axios.delete('/api/profile');
			dispatch({
				type: SET_CURRENT_USER,
				payload: {}
			});
		}
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Delete Education
export const deleteEducation = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	}
};

// Profile Loading
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	};
};

// Clear Profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	};
};
