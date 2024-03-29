const empresaTypes = `

    type Empresa {
        id: ID!
        idCpfCnpj: String!
        razao: String!
        fantasia: String!
        email: String!
        cep: String!
        estadoId: String!
        cidadeId: String!
        endereco: String!
        numero: String
        complemento: String
        bairro: String!
        telefone: String!
        celular: String
        obs: String
        stEmpresa: String!
        masterUserId: String
    }

    input EmpresaInput {
        idCpfCnpj: String!
        razao: String!
        fantasia: String!
        email: String!
        cep: String!
        estadoId: String!
        cidadeId: String!
        endereco: String!
        numero: String
        complemento: String
        bairro: String!
        telefone: String!
        celular: String
        obs: String
        stEmpresa: String!
    }

`;

const empresaQueries = `
    empresas: [Empresa]
    empresaById(id: ID!): Empresa!
    empresaByCpfCnpj(idCpfCnpj: String!): Empresa
    empresasByName(name: String!): [Empresa]
`;

const empresaMutations = `
    createEmpresa(input: EmpresaInput!): Empresa
    updateEmpresa(id: ID!, input: EmpresaInput!): Empresa
    changeStatus(id: ID!): Boolean
    deleteEmpresa(id: ID!): Boolean
`;

export { empresaTypes, empresaQueries, empresaMutations };
