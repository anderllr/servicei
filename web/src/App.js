/**
 * Main App
 */
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

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

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: BASE_URL,
    request: async operation => {
        const token = await sessionStorage.getItem("access_token_");
        const authorization = token ? `Bearer ${token}` : null;
        operation.setContext({
            headers: {
                authorization
            },
            fetchOptions: {
                credentials: "same-origin"
            }
        });
    }
});

const MainApp = () => (
    <ApolloProvider client={client}>
        <Provider store={configureStore({ apolloClient: client })}>
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
