/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

// css
import './lib/reactifyCss';

// firebase
import './firebase';

// app component
import App from './container/App';

import { configureStore } from './store';

const BASE_URL = "/flamingoql";

const uploadLink = createUploadLink({ uri: BASE_URL });

const cache = new InMemoryCache();

const middlewareAuth = new ApolloLink((operation, forward) => {
	const token = sessionStorage.getItem("access_token");
	const authorization = token ? `Bearer ${token}` : null;
	operation.setContext({
		headers: {
			authorization
		}
	});

	return forward(operation);
});

const httpLinkAuth = middlewareAuth.concat(uploadLink);

const client = new ApolloClient({
	link: httpLinkAuth,
	cache
});

const MainApp = () => (
	<Provider store={configureStore()}>
        <ApolloProvider client={client}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Router>
                    <Switch>
                        <Route path="/" component={App} />
                    </Switch>
                </Router>
            </MuiPickersUtilsProvider>
        </ApolloProvider>
	</Provider>
);

export default MainApp;
