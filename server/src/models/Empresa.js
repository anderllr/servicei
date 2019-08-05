import mongoose from "mongoose";

const EmpresaSchema = mongoose.Schema({
    idCpfCnpj: { type: String, required: true, trim: true },
    razao: { type: String, required: true, trim: true },
    fantasia: { type: String, required: true, trim: true },
    inscEstadual: { type: String, trim: true },
    inscMunicipal: { type: String, trim: true },
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
    endereco: { type: String },
    numero: { type: String, trim: true },
    complemento: { type: String, trim: true },
    bairro: { type: String, trim: true },
	telefone: { type: String },
	celular: { type: String },
    obs: { type: String },
    stEmpresa: {type: String, required: true}
});

export const Empresa = mongoose.model('Empresa', EmpresaSchema);
