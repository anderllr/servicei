import React from "react";
import { Query } from "react-apollo";

import { Route, Redirect } from "react-router-dom";

/*
import { AUTH_USER } from "../components/resources/queries/userQuery";

export default ({ component: Component, ...rest }) => (
    <Query query={AUTH_USER} fetchPolicy={"network-only"}>
        {({ loading, error, data }) => {
            if (error) return <h1>{error.message}</h1>;
            if (loading) return <h1>Loading...</h1>;
            //console.log('Auth User: ', data);
            return (
                <Route
                    {...rest}
                    render={props =>
                        data.authUser ? (
                            <div className="app">
                                <Logo />
                                <Nav {...props.history} />
                                <Component {...props} />
                                <Footer />
                            </div>
                        ) : (
                            <Redirect to={"/login"} />
                        )
                    }
                />
            );
        }}
    </Query>
);

*/
//const isAuthenticated = () => false;

export default ({ component: Component, ...rest, authUser }) => {
    return (
        <Route
            {...rest}
            render={props =>
                authUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};
