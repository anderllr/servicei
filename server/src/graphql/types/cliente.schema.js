const clienteTypes = `

    type Cliente {
        id: ID!
        name: String!
        email: String!
        estadoId: String!
        cidadeId: String!        
        fazenda: String!
        endereco: String!
        telefone: String!
        celular: String  
        maplink: String
        obs: String
    }

    input ClienteInput {
        name: String!
        email: String!
        estadoId: String!
        cidadeId: String!        
        fazenda: String!
        endereco: String!
        telefone: String!
        celular: String  
        maplink: String
        obs: String
    }

`;

const clienteQueries = `
    clientes: [Cliente]
    clienteById(id: ID!): Cliente!
    clientesByName(name: String!): [Cliente]
`;

const clienteMutations = `
    createCliente(input: ClienteInput!): Cliente
    updateCliente(id: ID!, input: ClienteInput!): Cliente
    deleteCliente(id: ID!): Boolean
`;

export { clienteTypes, clienteQueries, clienteMutations };
