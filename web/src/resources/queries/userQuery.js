import gql from "graphql-tag";

export const GET_USERS = gql`
    query {
        users {
            id
            email
            userName
            name
            contador
        }
    }
`;

export const AUTH_USER = gql`
    query {
        authUser {
            id
            email
            userName
            name
            contador
        }
    }
`;
