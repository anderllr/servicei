import mongoose from "mongoose";

const ItemFrotaSchema = new mongoose.Schema({
	itemId: { type: String, required: true }
});

const GrupoItemFrotaSchema = new mongoose.Schema({
	grupoItemId: { type: String, required: true },
	exceptItens: [ItemFrotaSchema]
});

const FrotaSchema = new mongoose.Schema(
	{
		nrFrota: { type: Number, required: true },
		name: { type: String, required: true },
		ano: { type: Number, required: true },
		chassi: { type: String, required: false },
		caminhao: { type: Boolean },
		exceptGrupos: [GrupoItemFrotaSchema]
	},
	{ collection: "frota" }
);

export const Frota = mongoose.model("Frota", FrotaSchema);
