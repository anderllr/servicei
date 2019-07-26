import mongoose from "mongoose";
import { DH_NOT_SUITABLE_GENERATOR } from "constants";

const ItemCaminhaoSchema = new mongoose.Schema({
	item: { type: String, required: true }
});

const CaminhaoSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		ano: { type: Number, required: true },
		placa: { type: String, required: false },
		vlKm: { type: Number, required: false },
		vlHoraMunck: { type: Number, required: false },
		itens: [ItemCaminhaoSchema]
	},
	{ collection: "caminhao" }
);

export const Caminhao = mongoose.model("Caminhao", CaminhaoSchema);
