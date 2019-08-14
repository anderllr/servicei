/**
 * Main App
 */
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
/*import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { HttpLink } from "apollo-link-http";
*/
// css
import "./lib/reactifyCss";

// firebase
import "./firebase";

// app component
import App from "./container/App";

import { configureStore } from "./store";

const BASE_URL = "http://localhost:3002/serviceiql";
/*
const httpLink = new HttpLink({
    uri: BASE_URL
});
*/
const client = new ApolloClient({
    uri: BASE_URL,
    fetchOptions: {
        credentials: "include"
    },
    request: async operation => {
        const token = await localStorage.getItem("access_token_");
        const authorization = token ? `Bearer ${token}` : null;
        operation.setContext({
            headers: {
                authorization
            }
        });
    },
    onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            console.log("GraphIndex: ", graphQLErrors);
        }
        if (networkError) {
            console.log("Neterror: ", networkError);
        }
    }
});

//const uploadLink = createUploadLink({ uri: BASE_URL });
/*
const cache = new InMemoryCache();

const middlewareAuth = new ApolloLink((operation, forward) => {
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDNmMWRmNjAzYTAxMzAwYWNjMDE2ZGIiLCJpYXQiOjE1NjUyNjcxMjZ9.EDv_Jwa1BXLPRWdCI-NqD0rSyXITyTlEGo_JEh6cwiQ";
    // const token = sessionStorage.getItem("access_token");
    const authorization = token ? `Bearer ${token}` : null;
    operation.setContext({
        headers: {
            authorization
        }
    });

    return forward(operation);
});

const httpLinkAuth = middlewareAuth.concat(httpLink);

const client = new ApolloClient({
    link: httpLinkAuth,
    cache
});
*/
const MainApp = () => (
    <ApolloProvider client={client}>
        <Provider store={configureStore()}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Router>
                    <Switch>
                        <Route path="/" component={App} />
                    </Switch>
                </Router>
            </MuiPickersUtilsProvider>
        </Provider>
    </ApolloProvider>
);

export default MainApp;
