const userTypes = `

    # User definition type
    type User {
        id: ID!
        name: String!
        userName: String!
        email: String!
        method: String!
        masterUserId: String
        stUser: String
    }

    type Token {
        id: ID!
        name: String!
        userName: String!
        email: String!
        method: String!
        masterUserId: String
        stUser: String
        token: String!
    }

    type ValidEmail {
        result: String!
    }

    input UserCreateInput {
        name: String!
        userName: String!
        email: String!
        method: String!
        password: String
        masterUserId: String
        stUser: String
    }

    input UserUpdateInput {
        name: String!
        userName: String!
        email: String!
        method: String!
        masterUserId: String
        stUser: String
    }

    input UserUpdatePasswordInput {
        password: String!
    }
`;

const userQueries = `
    users: [ User ]
    user(id: ID!): User!
    authUser: User
`;

const userMutations = `
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    updateUserPassword(lastPassword: String!, input: UserUpdatePasswordInput!): Boolean
    deleteUser(id: ID!): Boolean
    login(userName: String!, password: String!): Token
    loginemail(email: String!, password: String!): Token
    loginvalidemail(hash: String!): ValidEmail
    loginauth(email: String!, name: String!, accessToken: String!, providerId: String!, signInMethod: String!): Token
    sendEmailValidate(email: String!, rootUrl: String!): ValidEmail
`;

export { userTypes, userQueries, userMutations };
