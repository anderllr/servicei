import { userMutations } from "./types/user.schema";
/*import { clienteMutations } from "./types/cliente.schema";
import { frotaMutations } from "./types/frota.schema";
import { grupoItemMutations } from "./types/grupoitem.schema";
import { itensMutations } from "./types/itens.schema";
import { uploadMutations } from "./types/upload.schema";
import { vistoriaMutations } from "./types/vistoria.schema";
import { caminhaoMutations } from "./types/caminhao.schema";
import { freteMutations } from "./types/frete.schema";

const Mutation = `
    type Mutation {
        ${userMutations},
        ${clienteMutations},
        ${frotaMutations},
        ${grupoItemMutations},
        ${itensMutations},
        ${uploadMutations},
        ${vistoriaMutations},
        ${caminhaoMutations},
        ${freteMutations}
    }
`;

*/

const Mutation = `
    type Mutation {
        ${userMutations}
    }
`;

export { Mutation };
