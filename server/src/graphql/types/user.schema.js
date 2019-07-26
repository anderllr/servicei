const userTypes = `

    # User definition type
    type User {
        id: ID!
        name: String!
        userName: String!
        email: String!
    }

    type Token {
        token: String!
    }

    input UserCreateInput {
        name: String!
        userName: String!
        email: String!
        password: String!
    }

    input UserUpdateInput {
        name: String!
        userName: String!
        email: String!
    }

    input UserUpdatePasswordInput {
        password: String!
    }
`;

const userQueries = `
    users: [ User ]
    user(id: ID!): User!
    authUser: User
    login(userName: String!, password: String!): Token
`;

const userMutations = `
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    updateUserPassword(lastPassword: String!, input: UserUpdatePasswordInput!): Boolean
    deleteUser(id: ID!): Boolean
`;

export { userTypes, userQueries, userMutations };
