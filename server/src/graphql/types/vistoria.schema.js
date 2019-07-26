const vistoriaTypes = `

    type Vistoria {
        id: ID!
        frotaId: ID!
        clienteId: ID! 
        usuarioSaidaId: ID
        usuarioChegadaId: ID
        dtSaida: String!
        dtPrevisao: String!
        hrSaida: String!        
        horimetroSaida: Float!
        combustivelSaida: Int!        
        dtChegada: String
        hrChegada: String
        horimetroChegada: Float
        combustivelChegada: Int
        status: String!
        signSaida: [SignSaida]
        signChegada: [SignChegada]
        grupos: [VistoriaGrupo]
    }

    type VistoriaGrupo {
        grupoItemId: ID!
        grupoItem: String!
        imagem: String      
        itens: [VistoriaItem]
    }

    type VistoriaItem {
        itemId: ID!
        item: String!
        conforme: String!
        descNaoConforme: String
        informaQtde: Boolean
        qtItem: Int
        fileName: String!
        conformeFim: String
        descNaoConformeFim: String
        qtItemFim: Int
        fileNameFim: String
    }

    type SignSaida {
        vistoriador: String!
        checker: String!
        signer: String!
        signerRg: String!
        signerCpf: String!
        imgSignVistoriador: String!
        imgSignChecker: String!
        imgSignCliente: String!
    }

    type SignChegada {
        vistoriador: String!
        checker: String!
        signer: String!
        signerRg: String!
        signerCpf: String!
        imgSignVistoriador: String!
        imgSignChecker: String!
        imgSignCliente: String!
    }    

    type VistoriaList {
        id : ID!,
        dtSaida : String!,
        dtPrevisao : String!,
        frotaId: ID!,
        nrFrota : Int!,
        nameFrota : String!,
        clienteId: ID!,
        nameCliente: String!,
        fazenda: String
    }

    input VistoriaInput {
        frotaId: ID!
        clienteId: ID!        
        dtSaida: String!
        dtPrevisao: String!
        hrSaida: String!        
        horimetroSaida: Float!
        combustivelSaida: Int!        
        dtChegada: String
        hrChegada: String
        horimetroChegada: Float
        combustivelChegada: Int
        status: String!
        signSaida: [SignSaidaInput]
        signChegada: [SignChegadaInput]
        grupos: [VistoriaGrupoInput]
    }

    input VistoriaGrupoInput {
        grupoItemId: ID!
        grupoItem: String!
        imagem: String!
        itens: [VistoriaItemInput]
    }

    input VistoriaItemInput {
        itemId: ID!
        item: String!
        conforme: String!
        descNaoConforme: String
        informaQtde: Boolean
        qtItem: Int
        fileName: String!
        conformeFim: String
        descNaoConformeFim: String
        qtItemFim: Int
        fileNameFim: String
    }

    input SignSaidaInput {
        vistoriador: String!
        checker: String!
        signer: String!
        signerRg: String!
        signerCpf: String!
        imgSignVistoriador: String!
        imgSignChecker: String!
        imgSignCliente: String!
    }

    input SignChegadaInput {
        vistoriador: String!
        checker: String!
        signer: String!
        signerRg: String!
        signerCpf: String!
        imgSignVistoriador: String!
        imgSignChecker: String!
        imgSignCliente: String!
    }    
`;

const vistoriaQueries = `
    vistoria: [Vistoria]
    vistoriaById(id: ID!): Vistoria
    vistoriaDevolucao(frotaId: ID, clienteId: ID): [VistoriaList]
`;

const vistoriaMutations = `
    createVistoria(input: VistoriaInput!): Vistoria
    updateVistoria(id: ID!, input: VistoriaInput!): Vistoria
    deleteVistoria(id: ID!): Boolean
    deleteVistoriaAll: Boolean
`;

export {vistoriaTypes, vistoriaQueries, vistoriaMutations};
