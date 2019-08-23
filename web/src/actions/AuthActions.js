/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import firebase from "firebase/app";
import "firebase/auth";

import { NotificationManager } from "react-notifications";
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

import {
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider
} from "../firebase";

/**
 * Redux Action To Sigin User
 */
export const signinUser = (history, stateUser, loginuser) => dispatch => {
    const { email, password } = stateUser;
    //Execute mutation
    loginuser({ variables: { email, password } })
        .then(({ data: { loginemail } }) => {
            const { token, ...user } = loginemail;

            localStorage.setItem("access_token_", token);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
            history.push("/");
            NotificationManager.success(`Olá ${user.name}!`);
        })
        .catch(e => {
            dispatch({ type: LOGIN_USER_FAILURE });
            //TODO criar uma action que vai alterar o erro
            const { graphQLErrors } = e;

            const message = graphQLErrors[0].message;

            message === "unverified-email"
                ? (dispatch({ type: UNVERIFIED_EMAIL }),
                  console.log("Message: ", message),
                  NotificationManager.error("E-mail ainda não validado    "))
                : NotificationManager.error(message);
        });
};

/**
 * Redux Action To Signout User From  Firebase
 */
export const logoutUserFromFirebase = () => dispatch => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            dispatch({ type: LOGOUT_USER });
            localStorage.removeItem("user_id");
            NotificationManager.success("User Logout Successfully");
        })
        .catch(error => {
            NotificationManager.error(error.message);
        });
};

/**
 * Redux Action To Signup User
 */

export const signupUser = (history, stateUser, createUser) => dispatch => {
    const { name, email, password } = stateUser;
    //Execute mutation
    createuser({
        variables: { name, userName: email, email, method: "email", password }
    })
        .then(({ data: { createuser } }) => {
            const { id } = createUser;

            dispatch({ type: SIGNUP_USER_SUCCESS });
            NotificationManager.success(
                "Conta criada com sucesso, um e-mail foi enviado para validação!"
            );
        })
        .catch(e => {
            //TODO criar uma action que vai alterar o erro
            const { graphQLErrors } = e;

            dispatch({ type: SIGNUP_USER_FAILURE });
            NotificationManager.error(graphQLErrors[0].message);
        });
};

/**
 * Redux Action To Signin User With Auth to:
 * Facebook, Google, Twitter, GitHub
 */
export const authP = provider => {
    switch (provider) {
        case "facebook":
            return facebookAuthProvider; // new firebase.auth.FacebookAuthProvider();
        case "google":
            return googleAuthProvider; //new firebase.auth.GoogleAuthProvider();
        case "twitter":
            return twitterAuthProvider; // new firebase.auth.TwitterAuthProvider();
        case "github":
            return githubAuthProvider; // new firebase.auth.GithubAuthProvider();
        default:
            return { ...state };
    }
};

export const signinUserWithAuth = (
    history,
    loginauth,
    provider
) => dispatch => {
    dispatch({ type: LOGIN_USER });

    const authProvider = authP(provider);
    firebase
        .auth()
        .signInWithPopup(authProvider)
        .then(function(result) {
            const {
                user: { email, displayName },
                credential: { accessToken, providerId, signInMethod }
            } = result;
            //           console.log("Result: ", result);
            //  console.log("E-mail: ", email, "  AccessToken: ", accessToken, "  ProviderId: ", providerId, "  signInMethod: ", signInMethod);

            //Agora vai fazer a função de login efetiva
            //Execute mutation
            loginauth({
                variables: {
                    email,
                    name: displayName,
                    accessToken,
                    providerId,
                    signInMethod
                }
            })
                .then(({ data: { loginauth } }) => {
                    const { token, ...user } = loginauth;

                    localStorage.setItem("access_token_", token);
                    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
                    history.push("/");
                    NotificationManager.success(`Olá ${user.name}!`);
                })
                .catch(e => {
                    //TODO criar uma action que vai alterar o erro
                    const { graphQLErrors } = e;

                    dispatch({ type: LOGIN_USER_FAILURE });
                    NotificationManager.error(graphQLErrors[0].message);
                });
            //fim da função de login
        }) //Exceção de erro do login do facebook
        .catch(function(error) {
            dispatch({ type: LOGIN_USER_FAILURE });
            NotificationManager.error(error.message);
        });
};
