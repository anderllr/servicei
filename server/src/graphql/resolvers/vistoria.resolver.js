import mongoose from 'mongoose';
import {authenticated} from './auth.resolver';

export default {
  Query: {
    vistoria: authenticated (async (parent, args, {db: {Vistoria}}) => {
      const vistoria = await Vistoria.find (args);

      return vistoria.map (v => {
        return v;
      });
    }),
    vistoriaById: authenticated (async (parent, args, {db: {Vistoria}}) => {
      const vistoria = await Vistoria.findById (args.id);
      return vistoria;
    }),
    vistoriaDevolucao: authenticated (
      async (parent, {frotaId, clienteId}, {db: {Vistoria}}) => {
        const match = {
          status: 'SAIDA',
        };

        if (frotaId) match.frotaId = mongoose.Types.ObjectId (frotaId);
        if (clienteId) match.clienteId = mongoose.Types.ObjectId (clienteId);

        const vistoria = await Vistoria.aggregate ([
          {
            $match: match,
          },
          {
            $lookup: {
              from: 'frota',
              localField: 'frotaId',
              foreignField: '_id',
              as: 'frota',
            },
          },
          {$unwind: '$frota'},
          {
            $lookup: {
              from: 'clientes',
              localField: 'clienteId',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          {$unwind: {path: '$cliente', preserveNullAndEmptyArrays: true}},
          {
            $project: {
              id: 1,
              dtSaida: 1,
              dtPrevisao: 1,
              clienteId: 1,
              frotaId: '$frota._id',
              nrFrota: '$frota.nrFrota',
              nameFrota: '$frota.name',
              nameCliente: {$ifNull: ['$cliente.name', '']},
              fazenda: {$ifNull: ['$cliente.fazenda', '']},
            },
          },
        ]);

        return vistoria.map (
          ({
            _id,
            dtSaida,
            dtPrevisao,
            clienteId,
            frotaId,
            nrFrota,
            nameFrota,
            nameCliente,
            fazenda,
          }) => {
            return {
              id: _id,
              dtSaida,
              dtPrevisao,
              clienteId,
              frotaId,
              nrFrota,
              nameFrota,
              nameCliente,
              fazenda,
            };
          }
        );
      }
    ),
  },
  Mutation: {
    createVistoria: authenticated (
      async (parent, {input}, {authUser, db: {Vistoria}}) => {
        //Add logged user to register
        input.usuarioSaidaId = authUser.id;
        const vistoria = new Vistoria (input);
        await vistoria.save ();
        return vistoria;
      }
    ),
    updateVistoria: authenticated (
      async (parent, {id, input}, {db: {Vistoria}}) => {
        const vistoria = await Vistoria.findById (id);
        await vistoria.set (input).save ();
        return vistoria;
      }
    ),
    deleteVistoria: authenticated (async (parent, {id}, {db: {Vistoria}}) => {
      const vistoriaRemoved = await Vistoria.findByIdAndRemove (id);

      if (!vistoriaRemoved) {
        throw new Error ('Error removing vistoria');
      }

      return vistoriaRemoved;
    }),
    deleteVistoriaAll: authenticated (
      async (parent, args, {db: {Vistoria}}) => {
        const vistoriaRemoved = await Vistoria.deleteMany ({});

        if (!vistoriaRemoved) {
          throw new Error ('Erro ao remover as vistorias');
        }

        return vistoriaRemoved;
      }
    ),
  },
};
