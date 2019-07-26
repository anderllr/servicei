import mongoose from "mongoose";

const VistoriaItemSchema = new mongoose.Schema({
	itemId: { type: String, required: true },
	item: { type: String, required: true },
	conforme: { type: String, required: true },
	descNaoConforme: { type: String, required: false },
	informaQtde: { type: Boolean, required: true },
	qtItem: { type: Number, required: false },
	fileName: { type: String, required: true },
	conformeFim: { type: String, required: false },
	descNaoConformeFim: { type: String, required: false },
	qtItemFim: { type: Number, required: false },
	fileNameFim: { type: String, required: false }
});

const VistoriaGrupoSchema = new mongoose.Schema({
	grupoItemId: { type: String, required: true },
	grupoItem: { type: String, required: true },
	imagem: { type: String, required: true },
	itens: [VistoriaItemSchema]
});

const SignSaidaSchema = new mongoose.Schema({
	vistoriador: { type: String, required: true },
	checker: { type: String, required: true },
	signer: { type: String, required: true },
	signerRg: { type: String, required: true },
	signerCpf: { type: String, required: true },
	imgSignVistoriador: { type: String, required: true },
	imgSignChecker: { type: String, required: true },
	imgSignCliente: { type: String, required: true }
});

const SignChegadaSchema = new mongoose.Schema({
	vistoriador: { type: String, required: true },
	checker: { type: String, required: true },
	signer: { type: String, required: true },
	signerRg: { type: String, required: true },
	signerCpf: { type: String, required: true },
	imgSignVistoriador: { type: String, required: true },
	imgSignChecker: { type: String, required: true },
	imgSignCliente: { type: String, required: true }
});

const VistoriaSchema = new mongoose.Schema(
	{
		frotaId: { type: mongoose.Schema.ObjectId, required: true },
		clienteId: { type: mongoose.Schema.ObjectId, required: true },
		usuarioSaidaId: { type: mongoose.Schema.ObjectId, required: false },
		usuarioChegadaId: { type: mongoose.Schema.ObjectId, required: false },
		dtSaida: { type: String, required: true },
		dtPrevisao: { type: String, required: true },
		hrSaida: { type: String, required: true },
		horimetroSaida: { type: Number, required: true },
		combustivelSaida: { type: Number, required: true },
		dtChegada: { type: String, required: false },
		hrChegada: { type: String, required: false },
		horimetroChegada: { type: Number, required: false },
		combustivelChegada: { type: Number, required: false },
		status: { type: String, required: true },
		signSaida: SignSaidaSchema,
		signChegada: SignChegadaSchema,
		grupos: [VistoriaGrupoSchema]
	},
	{ collection: "vistoria" }
);

export const Vistoria = mongoose.model("Vistoria", VistoriaSchema);
