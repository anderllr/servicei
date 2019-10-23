/**
 * Feedback Actions
 */
import axios from "axios";

import { SEARCH_MUNICIPIOS, SEARCH_CEP, SEARCH_CNPJ } from "Actions/types";

/**
 * Redux Action To Get Common Data
 */
export const getMunicipios = uf => dispatch => {
    axios
        .get(
            `http://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        )
        .then(res => {
            dispatch({ type: SEARCH_MUNICIPIOS, payload: res.data });
        })
        .catch(error => {
            // error handling
        });
};

export const getDadosFromCep = cep => dispatch => {
    axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => {
            dispatch({
                type: SEARCH_CEP,
                payload: !res.data.erro ? res.data : { cep: "" }
            });
        })
        .catch(error => {
            // error handling
        });
};

export const getDadosFromCnpj = cnpj => dispatch => {
    const cnpjCons = cnpj.replace(/\D/g, "");
    axios
        .get(
            `${"https://cors-anywhere.herokuapp.com/"}https://www.receitaws.com.br/v1/cnpj/${cnpjCons}`
        )
        .then(res => {
            dispatch({
                type: SEARCH_CNPJ,
                payload:
                    res.data.status === "OK"
                        ? res.data
                        : { cnpj: "", status: "ERRO" }
            });
        })
        .catch(error => {
            // error handling
        });
};
