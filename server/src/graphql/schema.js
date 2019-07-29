import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";

import { Query } from "./query";
import { Mutation } from "./mutation";

import { userTypes } from "./types/user.schema";
import { empresaTypes } from "./types/empresa.schema";
/*import { frotaTypes } from "./types/frota.schema";
import { clienteTypes } from "./types/cliente.schema";
import { grupoItemTypes } from "./types/grupoitem.schema";
import { itensTypes } from "./types/itens.schema";
import { uploadTypes } from "./types/upload.schema";
import { vistoriaTypes } from "./types/vistoria.schema";
import { caminhaoTypes } from "./types/caminhao.schema";
import { freteTypes } from "./types/frete.schema";
*/
import userResolvers from "./resolvers/user.resolver";
import empresaResolvers from "./resolvers/user.resolver";
/*import frotaResolvers from "./resolvers/frota.resolver";
import clienteResolvers from "./resolvers/cliente.resolver";
import grupoItemResolvers from "./resolvers/grupoitem.resolver";
import itensResolvers from "./resolvers/itens.resolver";
import uploadResolvers from "./resolvers/upload.resolver";
import vistoriaResolvers from "./resolvers/vistoria.resolver";
import caminhaoResolvers from "./resolvers/caminhao.resolver";
import freteResolvers from "./resolvers/frete.resolver";

//using lodash to merge my resolvers
const resolvers = merge(
	userResolvers,
	frotaResolvers,
	caminhaoResolvers,
	clienteResolvers,
	grupoItemResolvers,
	itensResolvers,
	uploadResolvers,
	vistoriaResolvers,
	freteResolvers
);
*/

//using lodash to merge my resolvers
const resolvers = merge(
    userResolvers,
    empresaResolvers
);

const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`;
/*
export default makeExecutableSchema({
	typeDefs: [
		SchemaDefinition,
		Query,
		Mutation,
		userTypes,
		frotaTypes,
		caminhaoTypes,
		clienteTypes,
		grupoItemTypes,
		itensTypes,
		uploadTypes,
		vistoriaTypes,
		freteTypes
	],
	resolvers
});
*/

export default makeExecutableSchema({
	typeDefs: [
		SchemaDefinition,
		Query,
		Mutation,
        userTypes,
        empresaTypes
	],
	resolvers
});
