import { authenticated } from "./auth.resolver";

export default {
	Query: {
		frota: authenticated(async (parent, args, { db: { Frota } }) => {
			const frota = await Frota.find(args).sort("nrFrota");
			return frota.map(f => {
				return f;
			});
		}),
		frotaById: authenticated(async (parent, args, { db: { Frota } }) => {
			const frota = await Frota.findById(args.id);
			return frota;
		}),
		frotaByNumber: authenticated(
			async (parent, { nrFrota }, { db: { Frota } }) => {
				const frota = await Frota.find({ nrFrota });
				return frota[0];
			}
		),
		frotaCaminhao: authenticated(async (parent, args, { db: { Frota } }) => {
			const frota = await Frota.find({ caminhao: true }).sort("nrFrota");
			return frota.map(f => {
				return f;
			});
		}),
		frotaGrupoItem: authenticated(
			async (parent, { id }, { db: { GrupoItem, Frota } }) => {
				const frota = await Frota.findById(id);
				const grupoAll = await GrupoItem.find({
					itens: { $not: { $size: 0 } }
				});

				if (frota.exceptGrupos) {
				}
				return grupoAll.map(g => {
					return g;
				});
			}
		),
		frotaItensByGrupo: authenticated(
			async (parent, { id, grupoItemId }, { db: { GrupoItem, Frota } }) => {
				const frota = await Frota.findById(id);
				const grupo = await GrupoItem.findById(grupoItemId);
				if (frota.exceptGrupos.exceptItens) {
					return grupo.itens.filter(i => {
						return !frota.exceptGrupos[0].exceptItens.find(
							e => e.itemId === i.id
						);
					});
				} else return grupo.itens;
			}
		),
		frotaDisponivel: authenticated(
			async (parent, { nrFrota, name }, { db: { Frota, Vistoria } }) => {
				const options = {};
				if (nrFrota > 0) options.nrFrota = nrFrota;

				if (name !== "") options.name = new RegExp(name, "i");

				const vistoria = await Vistoria.find({ status: "SAIDA" });
				const locados = vistoria.map(({ frotaId }) => frotaId);
				//				console.log("Locados: ", locados);
				const frota = await Frota.find({
					$and: [{ _id: { $nin: locados } }, options]
				});
				return frota.map(f => {
					return f;
				});
			}
		)
	},
	Mutation: {
		createFrota: authenticated(async (parent, { input }, { db: { Frota } }) => {
			//valida número da frota se vier zero ẽ pq precisa gerar automático
			const { nrFrota, name, ano, chassi, caminhao, exceptGrupos } = input;
			let nrFrotaNew = 0;
			if (nrFrota === 0) {
				const nrF = await Frota.find()
					.sort({ nrFrota: -1 })
					.limit(1);
				if (nrF) {
					nrFrotaNew = nrF[0].nrFrota + 1;
				} else nrFrotaNew = 1;
			}
			if (nrFrotaNew === 0) nrFrotaNew = nrFrota;
			const newInput = {
				nrFrota: nrFrotaNew,
				name,
				ano,
				chassi,
				caminhao,
				exceptGrupos
			};

			const frota = new Frota(newInput);
			await frota.save();
			return frota;
		}),
		updateFrota: authenticated(
			async (parent, { id, input }, { db: { Frota } }) => {
				const frota = await Frota.findById(id);
				await frota.set(input).save();
				return frota;
			}
		),
		deleteFrota: authenticated(async (parent, { id }, { db: { Frota } }) => {
			const frotaRemoved = await Frota.findByIdAndRemove(id);

			if (!frotaRemoved) {
				throw new Error("Error removing person");
			}

			return frotaRemoved;
		})
	}
};
