const userTypes = `

    # User definition type
    type User {
        id: ID!
        name: String!
        userName: String!
        email: String!
        method: String!
    }

    type Token {
        id: ID!
        name: String!
        userName: String!
        email: String!
        method: String!
        token: String!
    }

    input UserCreateInput {
        name: String!
        userName: String!
        email: String!
        method: String!
        password: String
    }

    input UserUpdateInput {
        name: String!
        userName: String!
        email: String!
        method: String!
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
    loginvalidemail(hash: String!): Token
    loginauth(email: String!, name: String!, accessToken: String!, providerId: String!, signInMethod: String!): Token
`;

export { userTypes, userQueries, userMutations };
