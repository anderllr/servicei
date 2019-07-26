const grupoItemTypes = `

    type GrupoItem {
        id: ID!
        grupoItem: String!
        imagem: String
        itens: [ Item! ]!
    }

    input GrupoItemInput {
        grupoItem: String!
        imagem: String
    }
`;

const grupoItemQueries = `
    grupos: [GrupoItem]
    grupoItem(id: ID!): GrupoItem
`;

const grupoItemMutations = `
    createGrupoItem(input: GrupoItemInput!): GrupoItem
    updateGrupoItem(id: ID!, input: GrupoItemInput!): GrupoItem
    deleteGrupoItem(id: ID!): Boolean
`;

export { grupoItemTypes, grupoItemQueries, grupoItemMutations };
