import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	item: { type: String, required: true },
	informaQtde: { type: Boolean, required: true }
});

const GrupoItemSchema = new mongoose.Schema(
	{
		grupoItem: { type: String, required: true },
		imagem: { type: String },
		itens: [ItemSchema]
	},
	{
		collection: "grupoitem"
	}
);

export const GrupoItem = mongoose.model("GrupoItem", GrupoItemSchema);
