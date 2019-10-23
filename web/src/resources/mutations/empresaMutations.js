import gql from "graphql-tag";

export const CREATE_EMPRESA = gql`
    mutation createEmpresa($empresaInput: EmpresaInput!) {
        createEmpresa(input: $empresaInput) {
            id
        }
    }
`;

export const UPDATE_EMPRESA = gql`
    mutation updateEmpresa($id: ID!, $empresaInput: EmpresaInput!) {
        updateEmpresa(id: $id, input: $empresaInput) {
            id
        }
    }
`;

export const CHANGE_STATUS = gql`
    mutation changeStatus($id: ID!) {
        changeStatus(id: $id)
    }
`;

export const DELETE_EMPRESA = gql`
    mutation deleteEmpresa($id: ID!) {
        deleteEmpresa(id: $id)
    }
`;
