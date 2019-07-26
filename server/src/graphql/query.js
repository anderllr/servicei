import { userQueries } from "./types/user.schema";
/*import { frotaQueries } from "./types/frota.schema";
import { clienteQueries } from "./types/cliente.schema";
import { grupoItemQueries } from "./types/grupoitem.schema";
import { itensQueries } from "./types/itens.schema";
import { uploadQueries } from "./types/upload.schema";
import { vistoriaQueries } from "./types/vistoria.schema";
import { caminhaoQueries } from "./types/caminhao.schema";
import { freteQueries } from "./types/frete.schema";

const Query = `
    type Query {
        ${userQueries},
        ${frotaQueries},
        ${clienteQueries},
        ${grupoItemQueries},
        ${itensQueries},
        ${uploadQueries},
        ${vistoriaQueries},
        ${caminhaoQueries},
        ${freteQueries}
    }
`;
  Começar por enquanto só com users
*/
const Query = `
    type Query {
        ${userQueries}
    }
`;

export { Query };
