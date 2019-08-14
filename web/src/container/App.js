/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

import AdminRoute from "./AdminRoute";

// rct theme provider
import RctThemeProvider from './RctThemeProvider';

//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';

//Agency Layout
import AgencyLayout from './AgencyLayout';

//Main App
import RctDefaultLayout from './DefaultLayout';

// boxed layout
import RctBoxedLayout from './RctBoxedLayout';

// CRM layout
import CRMLayout from './CRMLayout';

// app signin
import AppSignIn from './SigninFirebase';
import AppSignUp from './SignupFirebase';

// async components
import {
   AsyncSessionLoginComponent,
   AsyncSessionRegisterComponent,
   AsyncSessionLockScreenComponent,
   AsyncSessionForgotPasswordComponent,
   AsyncSessionPage404Component,
   AsyncSessionPage500Component,
   AsyncTermsConditionComponent
} from 'Components/AsyncComponent/AsyncComponent';

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest, authUser }) =>
   <Route
      {...rest}
      render={props =>
         authUser
            ? <Component {...props} />
            : <Redirect
               to={{
                  pathname: '/signin',
                  state: { from: props.location }
               }}
            />}
   />;

class App extends Component {
   render() {
       const { location, match, user } = this.props;
       //Verifica se está dentro da raiz para direcionar para autenticação ou dashboard
       if (location.pathname === '/') {
         if (user === null) {
            return (<Redirect to={'/signin'} />);
         } else {
            return (<Redirect to={'/app/dashboard/ecommerce'} />);
         }
      }
      return (
         <RctThemeProvider>
            <NotificationContainer />
            <InitialPath
               path={`${match.url}app`}
               authUser={user}
               component={RctDefaultLayout}
            />
            <AdminRoute path="/horizontal" component={HorizontalLayout} />
            <AdminRoute path="/agency" component={AgencyLayout} />
            <AdminRoute path="/boxed" component={RctBoxedLayout} />
            <AdminRoute path="/dashboard" component={CRMLayout} authUser={user}/>
            <Route path="/signin" component={AppSignIn} />
            <Route path="/signup" component={AppSignUp} />
            <Route path="/session/login" component={AsyncSessionLoginComponent} />
            <Route path="/session/register" component={AsyncSessionRegisterComponent} />
            <Route path="/session/lock-screen" component={AsyncSessionLockScreenComponent} />
            <Route
               path="/session/forgot-password"
               component={AsyncSessionForgotPasswordComponent}
            />
            <Route path="/session/404" component={AsyncSessionPage404Component} />
            <Route path="/session/500" component={AsyncSessionPage500Component} />
            <Route path="/terms-condition" component={AsyncTermsConditionComponent} />
         </RctThemeProvider>
      );
   }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
   const { user } = authUser;
   return { user };
};

export default connect(mapStateToProps)(App);
