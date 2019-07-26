import mongoose from 'mongoose';
import {authenticated} from './auth.resolver';

const inputFrete = async (input, Caminhao) => {
  //retornará o input ajustado com os valores do frete atualizados
  //Pega as variáveis do input
  const {
    caminhaoId,
    kmInicial,
    kmCliente1,
    kmCliente2,
    kmFinal,
    hrMunckInicial,
    hrMunckFinal,
  } = input;

  //Busca o caminhão para pegar o valor do frete e da hora munck
  const caminhao = await Caminhao.findById (caminhaoId);
  const {vlKm, vlHoraMunck} = caminhao;

  let vlFreteTotal = 0;
  let qtKmRetorno = 0;
  let vlFreteRetorno = 0;
  //Agora verifica se tem valor de km para que possa ser calculado
  if (vlKm > 0) {
    input.vlKm = vlKm;
    if (kmCliente1 > 0) {
      const qtKmCliente1 = kmCliente1 - kmInicial;
      const vlFreteCliente1 = qtKmCliente1 * vlKm;

      vlFreteTotal += vlFreteCliente1;

      input.qtKmCliente1 = qtKmCliente1;
      input.vlFreteCliente1 = vlFreteCliente1;
    }

    if (kmCliente2 > 0) {
      const qtKmCliente2 =
        kmCliente2 - (kmCliente1 > 0 ? kmCliente1 : kmInicial);
      const vlFreteCliente2 = qtKmCliente2 * vlKm;

      input.qtKmCliente2 = qtKmCliente2;
      input.vlFreteCliente2 = vlFreteCliente2;

      vlFreteTotal += vlFreteCliente2;
    }
    if (kmCliente2 > 0 && kmFinal > 0) {
      //Acha a kilometragem de retorno
      qtKmRetorno = kmFinal - kmCliente2;
      vlFreteRetorno = qtKmRetorno * vlKm;
    } else if (kmFinal > 0 && kmCliente1 > 0) {
      //Acha a kilometragem de retorno
      qtKmRetorno = kmFinal - kmCliente1;
      vlFreteRetorno = qtKmRetorno * vlKm;
    } else if (kmFinal > 0) {
      qtKmRetorno = kmFinal - kmInicial;
      vlFreteRetorno = qtKmRetorno * vlKm;
    }
  }

  if (vlFreteTotal > 0 || vlFreteRetorno > 0)
    input.vlFreteTotal = vlFreteTotal + vlFreteRetorno;
  if (qtKmRetorno > 0) input.qtKmRetorno = qtKmRetorno;
  if (vlFreteRetorno > 0) input.vlFreteRetorno = vlFreteRetorno;

  if (vlHoraMunck > 0 && hrMunckInicial > 0 && hrMunckFinal > 0) {
    input.vlHoraMunck = vlHoraMunck;

    const qtHoraMunck = hrMunckFinal - hrMunckInicial;
    const vlMunckTotal = qtHoraMunck * vlHoraMunck;

    input.qtHoraMunck = qtHoraMunck;
    input.vlMunckTotal = vlMunckTotal;
  }

  return input;
};

export default {
  Query: {
    frete: authenticated (async (parent, args, {db: {Frete}}) => {
      const frete = await Frete.find (args).sort ({dtFrete: -1});
      return frete.map (f => {
        return f;
      });
    }),
    freteById: authenticated (async (parent, args, {db: {Frete}}) => {
      const frete = await Frete.findById (args.id);
      return frete;
    }),
    freteConsulta: authenticated (
      async (
        parent,
        {dtFreteIni, dtFreteFim, clienteId, frotaId},
        {db: {Frete}}
      ) => {
        const match = {};

        if (
          (dtFreteIni && dtFreteIni !== '') ||
          (dtFreteFim && dtFreteFim !== '')
        ) {
          const date = {};
          if (dtFreteIni && dtFreteIni !== '') {
            date.$gte = `${dtFreteIni.split ('/')[2]}-${dtFreteIni.split ('/')[1]}-${dtFreteIni.split ('/')[0]}`;
          }

          if (dtFreteFim && dtFreteFim !== '') {
            date.$lte = `${dtFreteFim.split ('/')[2]}-${dtFreteFim.split ('/')[1]}-${dtFreteFim.split ('/')[0]}`;
          }

          match.date = date;
        }
        if (frotaId && frotaId !== '')
          match.frotaId = mongoose.Types.ObjectId (frotaId);
        if (clienteId && clienteId !== '')
          match.clienteId1 = mongoose.Types.ObjectId (clienteId);

        const frete = await Frete.aggregate ([
          {
            $lookup: {
              from: 'clientes',
              localField: 'clienteId1',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          {$unwind: {path: '$cliente', preserveNullAndEmptyArrays: true}},
          {
            $lookup: {
              from: 'clientes',
              localField: 'clienteId2',
              foreignField: '_id',
              as: 'cliente2',
            },
          },
          {$unwind: {path: '$cliente2', preserveNullAndEmptyArrays: true}},
          {
            $lookup: {
              from: 'frota',
              localField: 'frotaId',
              foreignField: '_id',
              as: 'frota',
            },
          },
          {$unwind: {path: '$frota', preserveNullAndEmptyArrays: true}},
          {
            $project: {
              _id: 1,
              dtFrete: 1,
              descCliente1: '$cliente.name',
              descCliente2: {$ifNull: ['$cliente2.name', '']},
              nrFrota: {$ifNull: ['$frota.nrFrota', '']},
              descFrota: {$ifNull: ['$frota.name', '']},
              frotaTerceiro: 1,
              status: 1,
              frotaId: 1,
              clienteId1: 1,
              date: {
                $concat: [
                  {$substrBytes: ['$dtFrete', 6, 4]},
                  '-',
                  {$substrBytes: ['$dtFrete', 3, 2]},
                  '-',
                  {$substrBytes: ['$dtFrete', 0, 2]},
                ],
              },
            },
          },
          {
            $match: match,
          },
          {$sort: {date: -1}},
          {$limit: 30},
        ]);

        return frete.map (
          ({
            _id,
            dtFrete,
            descCliente1,
            descCliente2,
            nrFrota,
            descFrota,
            frotaTerceiro,
            status,
          }) => ({
            id: _id,
            dtFrete,
            descCliente1,
            descCliente2,
            descFrota: `${nrFrota}-${descFrota}`,
            frotaTerceiro,
            status,
          })
        );
      }
    ),
    freteDetalhe: authenticated (async (parent, {id}, {db: {Frete}}) => {
      const frete = await Frete.aggregate ([
        {
          $match: {
            _id: mongoose.Types.ObjectId (id),
          },
        },
        {
          $lookup: {
            from: 'caminhao', //"userinfo",       // other table name
            localField: 'caminhaoId', //"userId",   // name of users table field
            foreignField: '_id', //"userId", // name of userinfo table field
            as: 'caminhao', // alias for userinfo table
          },
        },
        {$unwind: {path: '$caminhao', preserveNullAndEmptyArrays: true}},
        // Join with user_info table
        {
          $lookup: {
            from: 'clientes', //"userinfo",       // other table name
            localField: 'clienteId1', //"userId",   // name of users table field
            foreignField: '_id', //"userId", // name of userinfo table field
            as: 'cliente', // alias for userinfo table
          },
        },
        {$unwind: {path: '$cliente', preserveNullAndEmptyArrays: true}},
        {
          $lookup: {
            from: 'clientes', //"userinfo",       // other table name
            localField: 'clienteId2', //"userId",   // name of users table field
            foreignField: '_id', //"userId", // name of userinfo table field
            as: 'cliente2', // alias for userinfo table
          },
        },
        {$unwind: {path: '$cliente2', preserveNullAndEmptyArrays: true}},
        {
          $lookup: {
            from: 'frota', //"userinfo",       // other table name
            localField: 'frotaId', //"userId",   // name of users table field
            foreignField: '_id', //"userId", // name of userinfo table field
            as: 'frota', // alias for userinfo table
          },
        },
        {$unwind: {path: '$frota', preserveNullAndEmptyArrays: true}},
        {
          $project: {
            _id: 1,
            dtFrete: 1,
            caminhaoId: 1,
            descCaminhao: '$caminhao.name',
            placa: '$caminhao.placa',
            qtEntrega: 1,
            descCliente1: '$cliente.name',
            descCliente2: {$ifNull: ['$cliente2.name', '']},
            nrFrota: {$ifNull: ['$frota.nrFrota', '']},
            descFrota: {$ifNull: ['$frota.name', '']},
            frotaTerceiro: 1,
            status: 1,
            frotaId: 1,
            clienteId1: 1,
            kmInicial: 1,
            kmCliente1: 1,
            kmCliente2: 1,
            kmFinal: 1,
            hrMunckInicial: 1,
            hrMunckFinal: 1,
            qtPedagio: 1,
            vlPedagio1: {$ifNull: ['$vlPedagio1', 0]},
            vlPedagio2: {$ifNull: ['$vlPedagio2', 0]},
            vlPedagio3: {$ifNull: ['$vlPedagio3', 0]},
            vlDespesas: {$ifNull: ['$vlDespesas', 0]},
            vlKm: {$ifNull: ['$vlKm', 0]},
            vlHoraMunck: {$ifNull: ['$vlHoraMunck', 0]},
            qtKmCliente1: {$ifNull: ['$qtKmCliente1', 0]},
            vlFreteCliente1: {$ifNull: ['$vlFreteCliente1', 0]},
            qtKmCliente2: {$ifNull: ['$qtKmCliente2', 0]},
            vlFreteCliente2: {$ifNull: ['$vlFreteCliente2', 0]},
            qtKmRetorno: {$ifNull: ['$qtKmRetorno', 0]},
            vlFreteRetorno: {$ifNull: ['$vlFreteRetorno', 0]},
            vlFreteTotal: {$ifNull: ['$vlFreteTotal', 0]},
            qtHoraMunck: {$ifNull: ['$qtHoraMunck', 0]},
            vlMunckTotal: {$ifNull: ['$vlMunckTotal', 0]},
            itens: 1,
          },
        },
      ]);

      return frete.map (
        ({
          _id,
          dtFrete,
          caminhaoId,
          descCaminhao,
          placa,
          qtEntrega,
          descCliente1,
          descCliente2,
          nrFrota,
          descFrota,
          frotaTerceiro,
          status,
          frotaId,
          clienteId1,
          kmInicial,
          kmCliente1,
          kmCliente2,
          kmFinal,
          hrMunckInicial,
          hrMunckFinal,
          qtPedagio,
          vlPedagio1,
          vlPedagio2,
          vlPedagio3,
          vlDespesas,
          vlKm,
          vlHoraMunck,
          qtKmCliente1,
          vlFreteCliente1,
          qtKmCliente2,
          vlFreteCliente2,
          qtKmRetorno,
          vlFreteRetorno,
          vlFreteTotal,
          qtHoraMunck,
          vlMunckTotal,
          itens,
        }) => ({
          id: _id,
          dtFrete,
          caminhaoId,
          descCaminhao,
          placa,
          qtEntrega,
          descCliente1,
          descCliente2,
          nrFrota,
          descFrota: `${nrFrota}-${descFrota}`,
          frotaTerceiro,
          status,
          frotaId,
          clienteId1,
          kmInicial,
          kmCliente1,
          kmCliente2,
          kmFinal,
          hrMunckInicial,
          hrMunckFinal,
          qtPedagio,
          vlPedagio1,
          vlPedagio2,
          vlPedagio3,
          vlDespesas,
          vlKm,
          vlHoraMunck,
          qtKmCliente1,
          vlFreteCliente1,
          qtKmCliente2,
          vlFreteCliente2,
          qtKmRetorno,
          vlFreteRetorno,
          vlFreteTotal,
          qtHoraMunck,
          vlMunckTotal,
          itens,
        })
      )[0];
    }),
  },
  Mutation: {
    createFrete: authenticated (
      async (parent, {input}, {db: {Frete, Caminhao}}) => {
        const inputNew = await inputFrete (input, Caminhao);
        const frete = await new Frete (inputNew).save ();
        return frete;
      }
    ),
    updateFrete: authenticated (
      async (parent, {id, input}, {db: {Frete, Caminhao}}) => {
        const frete = await Frete.findById (id);
        const inputNew = await inputFrete (input, Caminhao);
        await frete.set (inputNew).save ();
        return frete;
      }
    ),
    deleteFrete: authenticated (async (parent, {id}, {db: {Frete}}) => {
      const freteRemoved = await Frete.findByIdAndRemove (id);

      if (!freteRemoved) {
        throw new Error ('Erro ao remover o frete');
      }

      return freteRemoved;
    }),
    deleteFreteAll: authenticated (async (parent, args, {db: {Frete}}) => {
      const freteRemoved = await Frete.deleteMany ({});

      if (!freteRemoved) {
        throw new Error ('Erro ao remover o frete');
      }

      return freteRemoved;
    }),
  },
};
