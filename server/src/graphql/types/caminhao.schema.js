const caminhaoTypes = `

    type Caminhao {
        id: ID!
        name: String!
        ano: Int!
        placa: String!
        vlKm: Float
        vlHoraMunck: Float
        itens: [ItemCaminhao]
    }

    type ItemCaminhao {
        item: String!
    }

    type CaminhaoLista {
        id: ID!,
        name: String!
        placa: String!
        freteId: ID
        status: String!
    }

    input CaminhaoInput {
        name: String!
        ano: Int!
        placa: String!
        vlKm: Float
        vlHoraMunck: Float        
        itens: [ItemCaminhaoInput]
    }

    input ItemCaminhaoInput {
        item: String!
    }

`;

const caminhaoQueries = `
    caminhoes: [Caminhao]
    caminhaoById(id: ID!): Caminhao
    caminhaoLista: [CaminhaoLista]
`;

const caminhaoMutations = `
    createCaminhao(input: CaminhaoInput!): Caminhao
    updateCaminhao(id: ID!, input: CaminhaoInput!): Caminhao
    deleteCaminhao(id: ID!): Boolean
`;

export { caminhaoTypes, caminhaoQueries, caminhaoMutations };
