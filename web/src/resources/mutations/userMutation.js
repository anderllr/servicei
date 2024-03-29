import gql from "graphql-tag";

export const LOGIN = gql`
    mutation login($userName: String!, $password: String!) {
        login(userName: $userName, password: $password) {
            token
            id
            email
            userName
            name
            method
        }
    }
`;

export const EMAIL_LOGIN = gql`
    mutation loginemail($email: String!, $password: String!) {
        loginemail(email: $email, password: $password) {
            token
            id
            email
            userName
            name
            method
        }
    }
`;

export const AUTH_LOGIN = gql`
    mutation loginauth(
        $email: String!
        $name: String!
        $accessToken: String!
        $providerId: String!
        $signInMethod: String!
    ) {
        loginauth(
            email: $email
            name: $name
            accessToken: $accessToken
            providerId: $providerId
            signInMethod: $signInMethod
        ) {
            token
            id
            email
            userName
            name
            method
        }
    }
`;

export const EMAIL_VALIDATE = gql`
    mutation loginvalidemail($hash: String!) {
        loginvalidemail(hash: $hash) {
            result
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($userInput: UserCreateInput!) {
        createUser(input: $userInput) {
            id
        }
    }
`;

export const UPDATE_USER = gql`
    mutation updateUser($id: ID!, $userInput: UserUpdateInput!) {
        updateUser(id: $id, input: $userInput) {
            id
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation updateUserPassword(
        $lastPassword: String!
        $userPasswordInput: UserUpdatePasswordInput!
    ) {
        updateUserPassword(
            lastPassword: $lastPassword
            input: $userPasswordInput
        )
    }
`;

export const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

export const SEND_EMAIL_VALIDATE = gql`
    mutation sendEmailValidate($email: String!, $rootUrl: String!) {
        sendEmailValidate(email: $email, rootUrl: $rootUrl) {
            result
        }
    }
`;
