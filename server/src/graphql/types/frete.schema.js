const freteTypes = `

    type Frete {
		id: ID!
		caminhaoId: ID!
        dtFrete: String!
        qtEntrega: Int!
		clienteId1: ID!
		clienteId2: ID
		frotaId: ID
		frotaTerceiro: String
		kmInicial: Float!
		kmCliente1: Float
		kmCliente2: Float
		kmFinal: Float
		hrMunckInicial: Float
		hrMunckFinal: Float
		qtPedagio: Float
		vlPedagio1: Float
		vlPedagio2: Float
		vlPedagio3: Float
		vlDespesas: Float
		status: String!
		itens: [ItemFrete]
    }

    type ItemFrete {
        item: String!
        imagem: String
	}
	
	type FreteConsulta {
		id: ID
		dtFrete: String
		descCliente1: String
		descCliente2: String
		descFrota: String
		frotaTerceiro: String
		status: String
	}

	type FreteDetalhe {
		id: ID
		dtFrete : String
        caminhaoId: ID
        descCaminhao: String,
        placa: String
        qtEntrega: Int
        descCliente1: String
        descCliente2: String
        nrFrota: String
        descFrota: String
        frotaTerceiro: String
        status : String
        frotaId: ID
        clienteId1: ID
        kmInicial: Float
        kmCliente1: Float
        kmCliente2: Float
    	kmFinal: Float
        hrMunckInicial: Float
        hrMunckFinal: Float
		qtPedagio: Float
		vlPedagio1: Float
		vlPedagio2: Float
		vlPedagio3: Float
		vlDespesas: Float
		vlKm: Float
		vlHoraMunck: Float
		qtKmCliente1: Float
		vlFreteCliente1: Float
		qtKmCliente2: Float
		vlFreteCliente2: Float
		qtKmRetorno: Float
		vlFreteRetorno: Float
		vlFreteTotal: Float
		qtHoraMunck: Float
		vlMunckTotal: Float
        itens: [ItemFrete]
	}	

    input FreteInput {
		caminhaoId: ID!
		qtEntrega: Float!
		dtFrete: String!
		clienteId1: ID!
		clienteId2: ID
		frotaId: ID
		frotaTerceiro: String
		kmInicial: Float!
		kmCliente1: Float
		kmCliente2: Float
		kmFinal: Float
		hrMunckInicial: Float
		hrMunckFinal: Float
		qtPedagio: Float
		vlPedagio1: Float
		vlPedagio2: Float
		vlPedagio3: Float
		vlDespesas: Float
		status: String!
		vlKm: Float
		vlHoraMunck: Float
		qtKmCliente1: Float
		vlFreteCliente1: Float
		qtKmCliente2: Float
		vlFreteCliente2: Float
		qtKmRetorno: Float
		vlFreteRetorno: Float
		vlFreteTotal: Float
		qtHoraMunck: Float
		vlMunckTotal: Float
		itens: [ItemFreteInput]
    }

    input ItemFreteInput {
        item: String!
        imagem: String
    }
`;

const freteQueries = `
    frete: [Frete]
	freteById(id: ID!): Frete
	freteConsulta(dtFreteIni: String, dtFreteFim: String, clienteId: ID, frotaId: ID): [FreteConsulta]
	freteDetalhe(id: ID!): FreteDetalhe
`;

const freteMutations = `
    createFrete(input: FreteInput!): Frete
    updateFrete(id: ID!, input: FreteInput!): Frete
	deleteFrete(id: ID!): Boolean
	deleteFreteAll: Boolean
`;

export {freteTypes, freteQueries, freteMutations};
