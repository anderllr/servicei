/**
 * Formulário de dados da empresa
 */

import React, { Component } from "react";
import {
    Form,
    FormGroup,
    Input,
    Label,
    Col,
    FormText,
    FormFeedback
} from "reactstrap";
import Button from "@material-ui/core/Button";
import { Typeahead } from "react-bootstrap-typeahead";
import { graphql } from "@apollo/react-hoc";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";

// redux action
import { getMunicipios, getDadosFromCep, getDadosFromCnpj } from "Actions";

// intl messages
import IntlMessages from "Util/IntlMessages";

//masks functions
import { cpfCnpjMask, cepMask, phoneMask } from "Util/maskfuncs";

//validations
import { isValidEmail, isValidCpfCnpj, isValidCep } from "Util/validations";

//GraphQL Functions
import {
    CREATE_EMPRESA,
    UPDATE_EMPRESA,
    DELETE_EMPRESA
} from "Mutations/empresaMutations";

//GraphQL Queries
import {
    GET_EMPRESA_BY_CPFCNPJ,
    GET_EMPRESA_BY_ID, GET_EMPRESAS_CONS
} from "Queries/empresaQuery";


const initialState = {
    dadosEmpresa: {
        id: "",
        idCpfCnpj: "",
        razao: "",
        fantasia: "",
        email: "",
        estadoId: "12",
        cidadeId: "",
        nomeCidade: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        telefone: "",
        celular: "",
        obs: "",
        stEmpresa: "ATIVO"
    },
    estadoOptions: "",
    cepAnterior: "",
    idCpfCnpjAnterior: ""
};

class CadEmpresaDados extends Component {
    state = { ...initialState };

    handleErrors(e, title) {
        //Simple aproach to show error messages -- The better way is create a centralized function using apollo link
        //See documentation to understand another way: https://www.apollographql.com/docs/react/features/error-handling.html
        if (e.graphQLErrors) {
            NotificationManager.error(
                `Error on ${title} -> ${e.graphQLErrors[0].message}`
            );
        } else {
            NotificationManager.error(`Error on ${title} -> ${e}`);
        }
    }
    componentDidMount() {
        let { uf } = this.props;

        uf.sort((a, b) => {
            if (a.sigla > b.sigla) {
                return 1;
            }
            if (a.sigla < b.sigla) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        let estadoOptions = uf.map(data => (
            <option key={data.id} value={data.id}>
                {data.sigla}
            </option>
        ));
        this.props.getMunicipios("12");

        this.setState({ ...this.state, estadoOptions });

        if (this.props.id) {
            this.buscaEmpresaById(this.props.id);
        }
    }

    //Busca empresa pelo id
    buscaEmpresaById = id => {
        //Busca primeiro direto no banco de dados
        this.props.apolloClient
            .query({
                query: GET_EMPRESA_BY_ID,
                variables: { id }
            })
            .then(async ({ data: { empresaById } }) => {
                if (empresaById) {
                    this.setState({
                        dadosEmpresa: {
                            ...empresaById,
                            nomeCidade: ""
                        }
                    });

                    this.props.getMunicipios(empresaById.estadoId);
                }
            });
    };

    componentDidUpdate = async prevProps => {
        // Verifica se atualizou o CNPJ
        if (this.props.cnpj.status === "OK") {
            if (this.props.cnpj.cnpj !== prevProps.cnpj.cnpj) {
                this.updateFieldsEmpresa(this.props.cnpj);
            }
        } //FIM DO if (this.props.cnpj.status === 'OK') {
        // Verifica se atualizou o CEP
        if (this.props.cep.cep !== prevProps.cep.cep) {
            const {
                logradouro,
                complemento,
                bairro,
                ibge,
                localidade
            } = this.props.cep;
            const estadoId = ibge.substring(0, 2);

            if (this.state.dadosEmpresa.estadoId !== estadoId)
                await this.props.getMunicipios(ibge.substring(0, 2));
            this.setState({
                dadosEmpresa: {
                    ...this.state.dadosEmpresa,
                    idCpfCnpj: this.state.dadosEmpresa.idCpfCnpj,
                    endereco: logradouro,
                    complemento,
                    bairro,
                    estadoId,
                    cidadeId: ibge,
                    nomeCidade: localidade
                }
            });
        }

        if (this.props.municipios[0].id !== prevProps.municipios[0].id) {
            const { cidadeId } = this.state.dadosEmpresa;

            if (cidadeId !== "") {
                const nomeCidade = this.findCity(cidadeId);
                this.setState({
                    dadosEmpresa: {
                        ...this.state.dadosEmpresa,
                        nomeCidade
                    }
                });
            }
        }
    };
    /** PREENCHE OS CAMPOS */
    updateFieldsEmpresa = cnpjCons => {
        const cep = cepMask(cnpjCons.cep);
        this.setState({
            dadosEmpresa: {
                ...initialState.dadosEmpresa,
                idCpfCnpj: this.state.dadosEmpresa.idCpfCnpj,
                razao: cnpjCons.nome,
                fantasia: cnpjCons.fantasia,
                email: cnpjCons.email,
                cep,
                endereco: cnpjCons.logradouro,
                numero: cnpjCons.numero,
                complemento: cnpjCons.complemento,
                bairro: cnpjCons.bairro,
                telefone: cnpjCons.telefone,
                celular: "",
                obs: "",
                stEmpresa: "ATIVO"
            }
        });
        if (cep !== "" && isValidCep(cep) && cep !== this.state.cepAnterior) {
            this.props.getDadosFromCep(cep);
        }
    };
    /**
     * Alteração dos campos da empresa
     */
    onChangeDados = (key, value) => {
        let valor = "";

        switch (key) {
            case "idCpfCnpj":
                valor = cpfCnpjMask(value);
                break;
            case "cep":
                valor = cepMask(value);
                break;
            case "telefone":
                valor = phoneMask(value);
                break;
            case "celular":
                valor = phoneMask(value);
                break;
            default:
                valor = value;
        }

        this.setState({
            dadosEmpresa: {
                ...this.state.dadosEmpresa,
                [key]: valor
            }
        });
    };

    /* função da seleção do estado e na sequência da cidade*/
    onChangeEstado = e => {
        let selectedValue = e.target.value;

        this.setState({
            dadosEmpresa: {
                ...this.state.dadosEmpresa,
                estadoId: selectedValue
            }
        });

        this.props.getMunicipios(selectedValue);
    };

    findCity = cidadeId => {
        let city = "";
        const cityObj = this.props.municipios.filter(obj => {
            return obj.id.toString() === cidadeId.toString();
        });
        if (cityObj.length > 0) {
            city = cityObj[0].nome;
        }
        return city;
    };

    onChangeComplete = e => {
        if (e) {
            if (e[0]) {
                if (e[0].id) {
                    this.setState({
                        dadosEmpresa: {
                            ...this.state.dadosEmpresa,
                            cidadeId: e[0].id,
                            nomeCidade: e[0].nome
                        }
                    });
                }
            }
        }
    };

    /**
     * Function To Check Either The Form Is Valid Or Not
     * Return Boolean
     */
    isFormValid() {
        const {
            idCpfCnpj,
            razao,
            fantasia,
            email,
            estadoId,
            cidadeId,
            cep,
            endereco,
            numero,
            bairro,
            telefone
        } = this.state.dadosEmpresa;
        if (
            idCpfCnpj !== "" &&
            razao !== "" &&
            fantasia !== "" &&
            email !== "" &&
            estadoId !== "" &&
            cidadeId !== "" &&
            cep !== "" &&
            endereco !== "" &&
            numero !== "" &&
            telefone !== "" &&
            bairro !== "" &&
            isValidCep(cep) &&
            isValidCpfCnpj(idCpfCnpj) &&
            isValidEmail(email)
        ) {
            return true;
        } else {
            return false;
        }
    }
    //Validação para consulta do CEP
    onCepEnter = () => {
        this.setState({ cepAnterior: this.state.dadosEmpresa.cep });
    };

    onCepBlur = () => {
        const cep = this.state.dadosEmpresa.cep;

        if (cep !== "" && isValidCep(cep) && cep !== this.state.cepAnterior) {
            this.props.getDadosFromCep(cep);
        }
    };

    //Validação para consulta do CNPJ
    onCpfCnpjEnter = () => {
        this.setState({ idCpfCnpjAnterior: this.state.dadosEmpresa.idCpfCnpj });
    };

    onCpfCnpjBlur = () => {
        const idCpfCnpj = this.state.dadosEmpresa.idCpfCnpj;

        if (
            idCpfCnpj !== "" &&
            isValidCpfCnpj(idCpfCnpj) &&
            idCpfCnpj !== this.state.idCpfCnpjAnterior
        ) {
            //Busca primeiro direto no banco de dados
            this.props.apolloClient
                .query({
                    query: GET_EMPRESA_BY_CPFCNPJ,
                    variables: { idCpfCnpj }
                })
                .then(async ({ data: { empresaByCpfCnpj } }) => {
                    //                    const dadosEmpresa = { ...empresaByCpfCnpj };
                    if (empresaByCpfCnpj) {
                        this.setState({
                            dadosEmpresa: {
                                ...empresaByCpfCnpj,
                                nomeCidade: ""
                            }
                        });

                        this.props.getMunicipios(empresaByCpfCnpj.estadoId);
                    } //se vier nulo busca na receita
                    else {
                        this.props.getDadosFromCnpj(idCpfCnpj);
                    }
                });
        }
    };

    //*** ROTINAS DE TRATAMENTO DE DADOS COM A API */
    save = e => {
        e.preventDefault();

        const {
            id,
            idCpfCnpj,
            razao,
            fantasia,
            email,
            cep,
            estadoId,
            cidadeId,
            endereco,
            numero,
            complemento,
            bairro,
            telefone,
            celular,
            obs,
            stEmpresa
        } = this.state.dadosEmpresa;

        let empresaInput = {
            idCpfCnpj,
            razao,
            fantasia,
            email,
            cep,
            estadoId,
            cidadeId,
            endereco,
            numero,
            complemento,
            bairro,
            telefone,
            celular,
            obs,
            stEmpresa
        };

        if (id !== "") {
            //In update mode
            this.props
                .updateEmpresa({ variables: { id, empresaInput } })
                .then(() => {
                    NotificationManager.success(
                        "Empresa atualizada com sucesso!"
                    );
                })
                .catch(e => {
                    this.handleErrors(e, "Atualização da Empresa!");
                });
        } else {
            this.props
                .createEmpresa({ variables: { empresaInput } })
                .then(res => {
                    this.setState({
                        dadosEmpresa: {
                            ...this.state.dadosEmpresa,
                            id: res.data.createEmpresa.id
                        }
                    });

                    NotificationManager.success(
                        "Empresa cadastrada com sucesso!"
                    );
                })
                .catch(e => {
                    this.handleErrors(e, "Adicionar Empresa!");
                });
        }
    };

    render() {
        return (
            <div className="billing-form-warp py-4">
                <Form>
                    <FormGroup row>
                        <Col sm={3}>
                            <Label for="idCpfCnpj">
                                <IntlMessages id="empresa.idcpfcnpj" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="idCpfCnpj"
                                id="idCpfCnpj"
                                className="mb-4 mb-sm-0"
                                onFocus={this.onCpfCnpjEnter}
                                onBlur={this.onCpfCnpjBlur}
                                onChange={e =>
                                    this.onChangeDados(
                                        "idCpfCnpj",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.idCpfCnpj}
                                invalid={
                                    !isValidCpfCnpj(
                                        this.state.dadosEmpresa.idCpfCnpj
                                    ) &&
                                    this.state.dadosEmpresa.idCpfCnpj !== ""
                                }
                            />
                            <FormFeedback>Cpf/Cnpj Inválido!</FormFeedback>
                        </Col>
                        <Col sm={5}>
                            <Label for="razao">
                                <IntlMessages id="empresa.razao" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="razao"
                                id="razao"
                                onChange={e =>
                                    this.onChangeDados("razao", e.target.value)
                                }
                                value={this.state.dadosEmpresa.razao}
                            />
                        </Col>
                        <Col sm={4}>
                            <Label for="fantasia">
                                <IntlMessages id="empresa.fantasia" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="fantasia"
                                id="fantasia"
                                onChange={e =>
                                    this.onChangeDados(
                                        "fantasia",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.fantasia}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={3}>
                            <Label for="cep">
                                <IntlMessages id="empresa.cep" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="cep"
                                id="cep"
                                className="mb-4 mb-sm-0"
                                onFocus={this.onCepEnter}
                                onBlur={this.onCepBlur}
                                onChange={e =>
                                    this.onChangeDados("cep", e.target.value)
                                }
                                value={this.state.dadosEmpresa.cep}
                                invalid={
                                    !isValidCep(this.state.dadosEmpresa.cep) &&
                                    this.state.dadosEmpresa.cep !== ""
                                }
                            />
                            <FormFeedback>CEP Inválido!</FormFeedback>
                        </Col>
                        <Col sm={3}>
                            <Label for="estadoId">
                                <IntlMessages id="empresa.estadoid" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="select"
                                name="estadoId"
                                id="estadoId"
                                className="mb-4 mb-sm-0"
                                onChange={this.onChangeEstado}
                                value={this.state.dadosEmpresa.estadoId}
                            >
                                {this.state.estadoOptions}
                            </Input>
                        </Col>
                        <Col sm={6}>
                            <Label for="cidadeId">
                                <IntlMessages id="empresa.cidadeid" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Typeahead
                                id="cidadeId"
                                labelKey="nome"
                                filterBy={["nome"]}
                                multiple={false}
                                options={this.props.municipios}
                                key="id"
                                onChange={e => this.onChangeComplete(e)}
                                selected={[
                                    {
                                        id: this.state.dadosEmpresa.cidadeId,
                                        nome: this.state.dadosEmpresa.nomeCidade
                                    }
                                ]}
                                placeholder="Escolha uma cidade..."
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={8}>
                            <Label for="endereco">
                                <IntlMessages id="empresa.endereco" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="endereco"
                                id="endereco"
                                className="mb-4 mb-sm-0"
                                onChange={e =>
                                    this.onChangeDados(
                                        "endereco",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.endereco}
                            />
                        </Col>
                        <Col sm={4}>
                            <Label for="numero">
                                <IntlMessages id="empresa.numero" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="numero"
                                id="numero"
                                className="mb-4 mb-sm-0"
                                onChange={e =>
                                    this.onChangeDados("numero", e.target.value)
                                }
                                value={this.state.dadosEmpresa.numero}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={6}>
                            <Label for="complemento">
                                <IntlMessages id="empresa.complemento" />
                            </Label>
                            <Input
                                type="text"
                                name="complemento"
                                id="complemento"
                                className="mb-4 mb-sm-0"
                                onChange={e =>
                                    this.onChangeDados(
                                        "complemento",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.complemento}
                            />
                        </Col>
                        <Col sm={6}>
                            <Label for="bairro">
                                <IntlMessages id="empresa.bairro" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="bairro"
                                id="bairro"
                                className="mb-4 mb-sm-0"
                                onChange={e =>
                                    this.onChangeDados("bairro", e.target.value)
                                }
                                value={this.state.dadosEmpresa.bairro}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={6}>
                            <Label for="email">
                                <IntlMessages id="empresa.email" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                className="mb-4 mb-sm-0"
                                onChange={e =>
                                    this.onChangeDados("email", e.target.value)
                                }
                                value={this.state.dadosEmpresa.email}
                                invalid={
                                    !isValidEmail(
                                        this.state.dadosEmpresa.email
                                    ) && this.state.dadosEmpresa.email !== ""
                                }
                            />
                            <FormFeedback>Email Inválido!</FormFeedback>
                        </Col>
                        <Col sm={3}>
                            <Label for="telefone">
                                <IntlMessages id="empresa.telefone" />
                                <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="tel"
                                name="telefone"
                                id="telefone"
                                onChange={e =>
                                    this.onChangeDados(
                                        "telefone",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.telefone}
                            />
                        </Col>
                        <Col sm={3}>
                            <Label for="celular">
                                <IntlMessages id="empresa.celular" />
                            </Label>
                            <Input
                                type="tel"
                                name="celular"
                                id="celular"
                                onChange={e =>
                                    this.onChangeDados(
                                        "celular",
                                        e.target.value
                                    )
                                }
                                value={this.state.dadosEmpresa.celular}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={12}>
                            <Label for="obs">
                                <IntlMessages id="empresa.obs" />
                            </Label>
                            <Input
                                type="textarea"
                                name="obs"
                                id="obs"
                                onChange={e =>
                                    this.onChangeDados("obs", e.target.value)
                                }
                                value={this.state.dadosEmpresa.obs}
                            />
                        </Col>
                    </FormGroup>
                    <FormText color="danger">
                        <IntlMessages id="alerts.fieldrequired" />
                    </FormText>
                </Form>
                <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: 8 * 3 }}
                >
                    <Button
                        onClick={() => this.props.onBack()}
                        color="primary"
                        variant="contained"
                    >
                        <IntlMessages id="components.backPage" />
                    </Button>
                    <Button
                        disabled={!this.isFormValid()}
                        onClick={this.save}
                        color="primary"
                        variant="contained"
                    >
                        <IntlMessages id="components.saveContinue" />
                    </Button>
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({
    commonData: { uf, municipios, cep, cnpj },
    apolloClient
}) => {
    //const { uf, municipios, cep, cnpj } = commonData;
    return { uf, municipios, cep, cnpj, apolloClient };
};

export default compose(
    graphql(CREATE_EMPRESA, { name: "createEmpresa",
    options: {
        refetchQueries: [
            {
                query: GET_EMPRESAS_CONS
            }
        ]
    } }),
    graphql(UPDATE_EMPRESA, { name: "updateEmpresa",
    options: {
        refetchQueries: [
            {
                query: GET_EMPRESAS_CONS
            }
        ]
    } }),
    graphql(DELETE_EMPRESA, { name: "deleteEmpresa",
    options: {
        refetchQueries: [
            {
                query: GET_EMPRESAS_CONS
            }
        ]
    } }),
    connect(
        mapStateToProps,
        { getMunicipios, getDadosFromCep, getDadosFromCnpj }
    )
)(CadEmpresaDados);
