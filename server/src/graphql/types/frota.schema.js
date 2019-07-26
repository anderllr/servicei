const frotaTypes = `

    type Frota {
        id: ID!
        nrFrota: Int!
        name: String
        ano: Int!
        chassi: String,
        caminhao: Boolean
        exceptGrupos: [ExceptGrupo]
    }

    type ExceptGrupo {
        grupoItemId: ID!,
        exceptItens: [ExceptItem]
    }

    type ExceptItem {
        itemId: ID!
    }

    input ExceptItemInput {
        itemId: ID!
    }

    input ExceptGrupoInput {
        grupoItemId: ID!,
        exceptItens: [ExceptItemInput]
    }

    input FrotaInput {
        nrFrota: Int!
        name: String
        ano: Int!
        chassi: String,
        caminhao: Boolean,
        exceptGrupos: [ExceptGrupoInput]
    }
`;

const frotaQueries = `
    frota: [Frota]
    frotaById(id: ID!): Frota
    frotaByNumber(nrFrota: Int!): Frota
    frotaCaminhao: [Frota]
    frotaGrupoItem(id: ID!): [GrupoItem]
    frotaItensByGrupo(id: ID!, grupoItemId: ID!): [ Item ]
    frotaDisponivel(nrFrota: Int, name: String): [Frota]  
`;

const frotaMutations = `
    createFrota(input: FrotaInput!): Frota
    updateFrota(id: ID!, input: FrotaInput!): Frota
    deleteFrota(id: ID!): Boolean
`;

export { frotaTypes, frotaQueries, frotaMutations };
