import mongoose from 'mongoose';

const ItemFreteSchema = new mongoose.Schema ({
  item: {type: String, required: true},
  imagem: {type: String, required: false},
});

const FreteSchema = new mongoose.Schema (
  {
    caminhaoId: {type: mongoose.Schema.ObjectId, required: true},
    qtEntrega: {type: Number, required: true, enum: [1, 2]},
    dtFrete: {type: String, required: true},
    clienteId1: {type: mongoose.Schema.ObjectId, required: true},
    clienteId2: {type: mongoose.Schema.ObjectId, required: false},
    frotaId: {type: mongoose.Schema.ObjectId, required: false},
    frotaTerceiro: {type: String, required: false},
    kmInicial: {type: Number, required: true},
    kmCliente1: {type: Number, required: false},
    kmCliente2: {type: Number, required: false},
    kmFinal: {type: Number, required: false},
    hrMunckInicial: {type: Number, required: false},
    hrMunckFinal: {type: Number, required: false},
    qtPedagio: {type: Number, required: false},
    vlPedagio1: {type: Number, required: false},
    vlPedagio2: {type: Number, required: false},
    vlPedagio3: {type: Number, required: false},
    vlDespesas: {type: Number, required: false},
    vlKm: {type: Number, required: false},
    vlHoraMunck: {type: Number, required: false},
    qtKmCliente1: {type: Number, required: false},
    vlFreteCliente1: {type: Number, required: false},
    qtKmCliente2: {type: Number, required: false},
    vlFreteCliente2: {type: Number, required: false},
    vlFreteTotal: {type: Number, required: false},
    qtHoraMunck: {type: Number, required: false},
    vlMunckTotal: {type: Number, required: false},
    qtKmRetorno: {type: Number, required: false},
    vlFreteRetorno: {type: Number, required: false},
    status: {
      type: String,
      required: true,
      enum: ['ABERTO', 'ENCERRADO'],
    },
    itens: [ItemFreteSchema],
  },
  {collection: 'frete'}
);

export const Frete = mongoose.model ('Frete', FreteSchema);
