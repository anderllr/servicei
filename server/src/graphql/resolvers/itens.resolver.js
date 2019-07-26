import { authenticated } from './auth.resolver';

export default {
    Query: {
        //Remember that for this case we will have only one person ever
        itensByGrupo: authenticated(async (parent, { grupoItemId }, { db: { GrupoItem } }) => {
            const grupoItem = await GrupoItem.findById(grupoItemId);

            return grupoItem.itens;
        }),
    },
    Mutation: {
        createItem: authenticated(async (parent, { grupoItemId, input }, { db: { GrupoItem } }) => {
            const grupoItem = await GrupoItem.findById(grupoItemId);

            //Push returns number of array members
            const res = grupoItem.itens.push(input);

            await grupoItem.save();

            return grupoItem.itens[res - 1];
        }),
        updateItem: authenticated(async (parent, { grupoItemId, id, input }, { db: { GrupoItem } }) => {
            const grupoItem = await GrupoItem.findById(grupoItemId);
            const item = grupoItem.itens.id(id);
            item.set(input);
            await grupoItem.save();
            return grupoItem.itens.id(id);
        }),
        deleteItem: authenticated(async (parent, { grupoItemId, id }, { db: { GrupoItem } }) => {
            const grupoItem = await GrupoItem.findById(grupoItemId);
            const itemRemoved = await grupoItem.itens.id(id).remove();
            await grupoItem.save();

            if (!itemRemoved) {
                throw new Error('Error removing item');
            }

            return itemRemoved;
        }),
    },
};
