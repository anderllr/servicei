const itensTypes = `

    type Item {
        id: ID!
        item: String!
        informaQtde: Boolean!
    }

    input ItemInput {
        item: String!
        informaQtde: Boolean!
    }

`;

const itensQueries = `
    item(grupoItemId: ID!, id: ID!): Item
    itensByGrupo(grupoItemId: ID!): [ Item! ]!
`;

const itensMutations = `
    createItem(grupoItemId: ID!, input: ItemInput!): Item
    updateItem(grupoItemId: ID!, id: ID!, input: ItemInput!): Item
    deleteItem(grupoItemId: ID!, id: ID!): Boolean
`;

export { itensTypes, itensQueries, itensMutations };
