import mongoose from "mongoose";
import { authenticated } from "./auth.resolver";

export default {
	Query: {
		caminhoes: authenticated(async (parent, args, { db: { Caminhao } }) => {
			const caminhao = await Caminhao.find(args).sort("name");
			return caminhao.map(c => {
				return c;
			});
		}),
		caminhaoById: authenticated(async (parent, args, { db: { Caminhao } }) => {
			const caminhao = await Caminhao.findById(args.id);
			return caminhao;
		}),
		caminhaoLista: authenticated(async (parent, args, { db: { Caminhao } }) => {
			const caminhao = await Caminhao.find(args).sort("name");
			return caminhao.map(async ({ id, name, placa }) => {
				const frete = await Caminhao.aggregate([
					{
						$lookup: {
							from: "frete",
							localField: "_id",
							foreignField: "caminhaoId",
							as: "frete"
						}
					},
					{
						$unwind: "$frete"
					},
					{
						$project: {
							_id: 1,
							name: 1,
							placa: 1,
							freteId: "$frete._id",
							dtFrete: "$frete.dtFrete",
							status: "$frete.status"
						}
					},
					{
						$match: {
							status: "ABERTO",
							_id: mongoose.Types.ObjectId(id)
						}
					}
				]);
				const freteId = frete.length > 0 ? frete[0].freteId : null;
				const status = freteId ? "PENDENTE" : "DISPONÍVEL";

				const itemC = {
					id,
					name,
					placa,
					freteId,
					status
				};
				return itemC;
			});
		})
	},
	Mutation: {
		createCaminhao: authenticated(
			async (parent, { input }, { db: { Caminhao } }) => {
				const caminhao = await new Caminhao(input).save();
				return caminhao;
			}
		),
		updateCaminhao: authenticated(
			async (parent, { id, input }, { db: { Caminhao } }) => {
				const caminhao = await Caminhao.findById(id);
				await caminhao.set(input).save();
				return caminhao;
			}
		),
		deleteCaminhao: authenticated(
			async (parent, { id }, { db: { Caminhao } }) => {
				const caminhaoRemoved = await Caminhao.findByIdAndRemove(id);

				if (!caminhaoRemoved) {
					throw new Error("Erro ao remover o caminhão");
				}

				return caminhaoRemoved;
			}
		)
	}
};
