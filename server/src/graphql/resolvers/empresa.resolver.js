import { authenticated } from "./auth.resolver";

export default {
	Query: {
		empresas: authenticated(async (parent, args, { db: { Empresa } }) => {
			const empresas = await Empresa.find(args).sort("razao");
			return empresas.map(empresa => {
				return empresa;
			});
		}),
		empresaById: authenticated(async (parent, args, { db: { Empresa } }) => {
			const empresa = await Empresa.findById(args.id);
			return empresa;
		}),
		empresasByName: authenticated(
			async (parent, { name }, { db: { Empresa } }) => {
                //TODO: Colocar a busca para razao ou fantasia, afim de trazer todos os registros
				const empresas = await Empresa.find({ razao: new RegExp(name, "i") });
				return empresas.map(empresa => {
					empresa._id = empresa._id.toString();
					return empresa;
				});
			}
		)
	},
	Mutation: {
		createEmpresa: authenticated(
			async (parent, { input }, { db: { Empresa } }) => {
                const empresa = await new Empresa(input).save();
				return empresa;
			}
		),
		updateEmpresa: authenticated(
			async (parent, { id, input }, { db: { Empresa } }) => {
				const empresa = await Empresa.findById(id);
				empresa.set(input);
				await empresa.save();
				if (!empresa) {
					return false;
				}
				return empresa;
			}
		),
		deleteEmpresa: authenticated(
			async (parent, { id }, { db: { Empresa } }) => {
				const empresaRemoved = await Empresa.findByIdAndRemove(id);

				if (!empresaRemoved) {
					throw new Error("Error removing empresa");
				}

				return empresaRemoved;
			}
		)
	}
};
