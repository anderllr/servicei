/**
 * Sign Up With Firebase
 */
import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input, FormFeedback } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
import { Fab } from "@material-ui/core";

//GraphQl Queries
import { CREATE_USER, AUTH_LOGIN } from "Mutations/userMutation";

// components
import { SessionSlider } from "Components/Widgets";

// app config
import AppConfig from "Constants/AppConfig";

// redux action
import { signupUser, signinUserWithAuth } from "Actions";

class Signup extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        checkTerms: false
    };

    /**
     * On User Signup
     */
    onUserSignUp() {
        if (this.state.email !== "" && this.state.password !== "") {
            this.props.signupUser(
                this.props.history,
                this.state,
                this.props.createuser
            );
        }
    }

    render() {
        const {
            name,
            email,
            password,
            confirmPassword,
            checkTerms
        } = this.state;
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
                                                width="110"
                                                height="35"
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            to="/signin"
                                            className="mr-15 text-white"
                                        >
                                            Already have an account?
                                        </Link>
                                        <Button
                                            component={Link}
                                            to="/signin"
                                            variant="contained"
                                            className="btn-light"
                                        >
                                            Sign In
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
                                        <div className="session-head mb-15">
                                            <h2>
                                                Get started with{" "}
                                                {AppConfig.brandName}
                                            </h2>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="text"
                                                    value={name}
                                                    name="user-name"
                                                    id="user-name"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Your Name"
                                                    onChange={e =>
                                                        this.setState({
                                                            name: e.target.value
                                                        })
                                                    }
                                                />
                                                <span className="has-icon">
                                                    <i className="ti-user" />
                                                </span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Email Address"
                                                    onChange={e =>
                                                        this.setState({
                                                            email:
                                                                e.target.value
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
                                                    onChange={e =>
                                                        this.setState({
                                                            password:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                                <span className="has-icon">
                                                    <i className="ti-lock" />
                                                </span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={confirmPassword}
                                                    type="Password"
                                                    name="user-confirm-pwd"
                                                    id="confirmpwd"
                                                    className="has-input input-lg"
                                                    placeholder="Confirme a senha"
                                                    onChange={e =>
                                                        this.setState({
                                                            confirmPassword:
                                                                e.target.value
                                                        })
                                                    }
                                                    invalid
                                                />
                                                <span className="has-icon">
                                                    <i className="ti-lock" />
                                                </span>
                                                <FormFeedback
                                                    valid={
                                                        password ==
                                                        confirmPassword
                                                    }
                                                >
                                                    Senha não confere
                                                </FormFeedback>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    className="btn-info text-white btn-block w-100"
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() =>
                                                        this.onUserSignUp()
                                                    }
                                                >
                                                    Sign Up
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
                                        <p>
                                            <Link
                                                to="/terms-condition"
                                                className="text-muted"
                                            >
                                                Terms of Service
                                            </Link>
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
    const { loading } = authUser;
    return { loading };
};

export default compose(
    graphql(CREATE_USER, {
        name: "createuser"
    }),
    graphql(AUTH_LOGIN, {
        name: "loginauth"
    }),
    connect(
        mapStateToProps,
        {
            signupUser,
            signinUserWithAuth
        }
    )
)(Signup);
