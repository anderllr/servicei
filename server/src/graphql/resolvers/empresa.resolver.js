import { authenticated, masterUserId } from "./auth.resolver";

export default {
    Query: {
        empresas: authenticated(
            async (parent, args, { db: { Empresa }, authUser }) => {
                const empresas = await Empresa.find({
                    masterUserId: masterUserId(authUser)
                }).sort("razao");
                return empresas.map(empresa => {
                    return empresa;
                });
            }
        ),
        empresaById: authenticated(
            async (parent, args, { db: { Empresa } }) => {
                const empresa = await Empresa.findById(args.id);
                return empresa;
            }
        ),
        empresasByName: authenticated(
            async (parent, { name }, { db: { Empresa }, authUser }) => {
                //TODO: Colocar a busca para razao ou fantasia, afim de trazer todos os registros
                const empresas = await Empresa.find({
                    razao: new RegExp(name, "i"),
                    masterUserId: masterUserId(authUser)
                });
                return empresas.map(empresa => {
                    empresa._id = empresa._id.toString();
                    return empresa;
                });
            }
        ),
        empresaByCpfCnpj: authenticated(
            async (parent, { idCpfCnpj }, { db: { Empresa }, authUser }) => {
                const empresa = await Empresa.findOne({
                    idCpfCnpj,
                    masterUserId: masterUserId(authUser)
                });
                return empresa;
            }
        )
    },
    Mutation: {
        createEmpresa: authenticated(
            async (parent, { input }, { db: { Empresa }, authUser }) => {
                if (!input.masterUserId) {
                    input.masterUserId =
                        authUser.masterUserId &&
                        authUser.masterUserId !== "same"
                            ? authUser.masterUserId
                            : authUser.id;
                }
                const empresa = await new Empresa(input).save();
                return empresa;
            }
        ),
        updateEmpresa: authenticated(
            async (parent, { id, input }, { db: { Empresa }, authUser }) => {
                const empresa = await Empresa.findById(id);

                if (!empresa.masterUserId) {
                    input.masterUserId =
                        authUser.masterUserId &&
                        authUser.masterUserId !== "same"
                            ? authUser.masterUserId
                            : authUser.id;
                }

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
        ),
        changeStatus: authenticated(
            async (parent, { id, input }, { db: { Empresa } }) => {
                const empresa = await Empresa.findById(id);
                const stEmpresa =
                    empresa.stEmpresa === "ATIVO" ? "CANCELADO" : "ATIVO";
                empresa.set({ stEmpresa });
                await empresa.save();
                if (!empresa) {
                    return false;
                }
                return true;
            }
        )
    }
};
