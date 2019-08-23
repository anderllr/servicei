/**
 * Auth User Reducers
 */
import {
    LOGIN_USER,
    UNVERIFIED_EMAIL,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
    user: null,
    unverified: true,
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true };

        case UNVERIFIED_EMAIL:
            return { ...state, unverified: true };

        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case LOGIN_USER_FAILURE:
            return { ...state, loading: false };

        case LOGOUT_USER:
            return { ...state, user: null };

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            return { ...state, loading: false };

        case SIGNUP_USER_FAILURE:
            return { ...state, loading: false };

        default:
            return { ...state };
    }
};
