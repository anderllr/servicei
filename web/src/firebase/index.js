/**
 * Firebase Login
 */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var config = {
    apiKey: "AIzaSyCyV0cHTHOgJN1ZxXYMWEpTNeCe1Ig5FQc",
    authDomain: "servicei-auth-project.firebaseapp.com",
    databaseURL: "https://servicei-auth-project.firebaseio.com",
    projectId: "servicei-auth-project",
    storageBucket: "",
    messagingSenderId: "728788994483",
    appId: "1:728788994483:web:7de496189b30689d"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();

export {
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    database
};
