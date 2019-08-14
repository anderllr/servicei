/**
 * Signin Firebase
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
import { Fab } from "@material-ui/core";

//GraphQl Queries
import { EMAIL_LOGIN, AUTH_LOGIN } from "Mutations/userMutation";

// components
import { SessionSlider } from "Components/Widgets";

// app config
import AppConfig from "Constants/AppConfig";

// redux action
import { signinUser, signinUserWithAuth } from "Actions";

class Signin extends Component {
    state = {
        email: "",
        password: ""
    };

    /**
     * On User Login
     */
    onUserLogin = () => {
        if (this.state.email !== "" && this.state.password !== "") {
            this.props.signinUser(
                this.props.history,
                this.state,
                this.props.loginemail
            );
        }
    };

    /**
     * On User Sign Up
     */
    onUserSignUp = () => {
        this.props.history.push("/signup");
    };

    render() {
        const { email, password } = this.state;
        const { loading } = this.props;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    {loading && <LinearProgress />}
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img
                                                src={AppConfig.appLogo}
                                                alt="session-logo"
                                                className="img-fluid"
                                                width="110"
                                                height="35"
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                        <a
                                            className="mr-15"
                                            onClick={() => this.onUserSignUp()}
                                        >
                                            Create New account?
                                        </a>
                                        <Button
                                            variant="contained"
                                            className="btn-light"
                                            onClick={() => this.onUserSignUp()}
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-7 col-md-7 col-lg-8">
                                    <div className="session-body text-center">
                                        <div className="session-head mb-30">
                                            <h2 className="font-weight-bold">
                                                Get started with{" "}
                                                {AppConfig.brandName}
                                            </h2>
                                            <p className="mb-0">
                                                Most powerful ReactJS admin
                                                panel
                                            </p>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Email Address"
                                                    onChange={event =>
                                                        this.setState({
                                                            email:
                                                                event.target
                                                                    .value
                                                        })
                                                    }
                                                />
                                                <span className="has-icon">
                                                    <i className="ti-email" />
                                                </span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className="has-input input-lg"
                                                    placeholder="Password"
                                                    onChange={event =>
                                                        this.setState({
                                                            password:
                                                                event.target
                                                                    .value
                                                        })
                                                    }
                                                />
                                                <span className="has-icon">
                                                    <i className="ti-lock" />
                                                </span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() =>
                                                        this.onUserLogin()
                                                    }
                                                >
                                                    Sign In
                                                </Button>
                                            </FormGroup>
                                        </Form>
                                        <p className="mb-20">or sign in with</p>
                                        <Fab
                                            size="small"
                                            variant="round"
                                            className="btn-facebook mr-15 mb-20 text-white"
                                            onClick={() =>
                                                this.props.signinUserWithAuth(
                                                    this.props.history,
                                                    this.props.loginauth,
                                                    "facebook"
                                                )
                                            }
                                        >
                                            <i className="zmdi zmdi-facebook" />
                                        </Fab>
                                        <Fab
                                            size="small"
                                            variant="round"
                                            className="btn-google mr-15 mb-20 text-white"
                                            onClick={() =>
                                                this.props.signinUserWithAuth(
                                                    this.props.history,
                                                    this.props.loginauth,
                                                    "google"
                                                )
                                            }
                                        >
                                            <i className="zmdi zmdi-google" />
                                        </Fab>
                                        <Fab
                                            size="small"
                                            variant="round"
                                            className="btn-twitter mr-15 mb-20 text-white"
                                            onClick={() =>
                                                this.props.signinUserWithAuth(
                                                    this.props.history,
                                                    this.props.loginauth,
                                                    "twitter"
                                                )
                                            }
                                        >
                                            <i className="zmdi zmdi-twitter" />
                                        </Fab>
                                        <Fab
                                            size="small"
                                            variant="round"
                                            className="btn-instagram mr-15 mb-20 text-white"
                                            onClick={() =>
                                                this.props.signinUserWithAuth(
                                                    this.props.history,
                                                    this.props.loginauth,
                                                    "github"
                                                )
                                            }
                                        >
                                            <i className="zmdi zmdi-github-alt" />
                                        </Fab>
                                        <p className="text-muted">
                                            By signing up you agree to{" "}
                                            {AppConfig.brandName}
                                        </p>
                                        <p className="mb-0">
                                            <a
                                                target="_blank"
                                                href="#/terms-condition"
                                                className="text-muted"
                                            >
                                                Terms of Service
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-4">
                                    <SessionSlider />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </QueueAnim>
        );
    }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
    const { user, loading } = authUser;
    return { user, loading };
};

export default compose(
    graphql(EMAIL_LOGIN, {
        name: "loginemail"
    }),
    graphql(AUTH_LOGIN, {
        name: "loginauth"
    }),
    connect(
        mapStateToProps,
        {
            signinUser,
            signinUserWithAuth
        }
    )
)(Signin);
