import gql from "graphql-tag";

export const GET_EMPRESAS = gql`
    query {
        empresas {
            id
            idCpfCnpj
            razao
            fantasia
            email
            cep
            estadoId
            cidadeId
            endereco
            numero
            complemento
            bairro
            telefone
            celular
            obs
            stEmpresa
        }
    }
`;

export const GET_EMPRESAS_CONS = gql`
    query {
        empresas {
            id
            idCpfCnpj
            razao
            fantasia
            stEmpresa
        }
    }
`;

export const GET_EMPRESA_BY_ID = gql`
    query empresaById($id: ID!) {
        empresaById(id: $id) {
            id
            idCpfCnpj
            razao
            fantasia
            email
            cep
            estadoId
            cidadeId
            endereco
            numero
            complemento
            bairro
            telefone
            celular
            obs
            stEmpresa
        }
    }
`;

export const GET_EMPRESA_BY_CPFCNPJ = gql`
    query empresaByCpfCnpj($idCpfCnpj: String!) {
        empresaByCpfCnpj(idCpfCnpj: $idCpfCnpj) {
            id
            idCpfCnpj
            razao
            fantasia
            email
            cep
            estadoId
            cidadeId
            endereco
            numero
            complemento
            bairro
            telefone
            celular
            obs
            stEmpresa
        }
    }
`;

export const GET_EMPRESA_BY_NAME = gql`
    query empresaById($name: String!) {
        empresaById(name: $name) {
            id
            idCpfCnpj
            razao
            fantasia
            email
            cep
            estadoId
            cidadeId
            endereco
            numero
            complemento
            bairro
            telefone
            celular
            obs
            stEmpresa
        }
    }
`;
