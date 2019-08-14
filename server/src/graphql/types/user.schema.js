const userTypes = `

    # User definition type
    type User {
        id: ID!
        name: String!
        userName: String!
        email: String!
        contador: Boolean!
    }

    type Token {
        id: ID!
        name: String!
        userName: String!
        email: String!
        contador: Boolean!
        token: String!
    }

    input UserCreateInput {
        name: String!
        userName: String!
        email: String!
        contador: Boolean!
        password: String!
    }

    input UserUpdateInput {
        name: String!
        userName: String!
        email: String!
        contador: Boolean!
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
    loginauth(email: String!, accessToken: String!, providerId: String!, signInMethod: String!): Token
`;

export { userTypes, userQueries, userMutations };
