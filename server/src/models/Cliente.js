import mongoose from "mongoose";

const ClienteSchema = mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: {
		type: String,
		required: true,
		trim: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please enter a email format"
		]
	},
	estadoId: { type: String, required: true },
	cidadeId: { type: String, required: true },
	fazenda: { type: String },
	endereco: { type: String },
	telefone: { type: String },
	celular: { type: String },
	maplink: { type: String },
	obs: { type: String }
});

export const Cliente = mongoose.model("Cliente", ClienteSchema);
