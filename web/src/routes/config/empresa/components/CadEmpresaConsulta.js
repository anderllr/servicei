/**
 * Basic Table
 */
import React, { Component, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Badge } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { graphql } from "@apollo/react-hoc";
import { compose } from "react-apollo";
import SweetAlert from "react-bootstrap-sweetalert";
import { NotificationManager } from "react-notifications";

// rct card box
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

//GraphQL Queries/Mutations
import { GET_EMPRESAS_CONS } from "Queries/empresaQuery";
import { CHANGE_STATUS } from "Mutations/empresaMutations";

const initialState = {
    warning: {
        id: "",
        show: false,
        confirmBtnText: "",
        title: "",
        description: ""
    }
};

class CadEmpresaConsulta extends Component {
    state = { ...initialState };

    onCancelStatus = () => {
        this.setState({ ...initialState });
    };

    onConfirmStatus = (stEmpresa, id) => {
        const descStatus = stEmpresa === "ATIVO" ? "cancelar" : "ativar";
        const description =
            stEmpresa === "ATIVO"
                ? "Se ela for cancelada não ficará visível nas buscas!"
                : "Se for ativada será possível efetuar lançamentos nela";

        const warning = {
            id,
            show: true,
            confirmBtnText: `Sim, desejo ${descStatus}`,
            title: `Tem certeza que deseja ${descStatus}?`,
            description
        };

        this.setState({ warning });
    };

    onChangeStatus = id => {
        this.props
            .changeStatus({
                variables: {
                    id
                }
            })
            .then(res => {
                if (res.data.changeStatus) {
                    NotificationManager.success(
                        "Registro alterado com sucesso!"
                    );
                    this.setState({ ...initialState });
                }
            })
            .catch(error =>
                NotificationManager.error("Erro na atualização do registro!")
            );
    };
    render() {
        if (this.props.getEmpresas.loading) {
            return <div>Loading...</div>;
        } else {
            const { empresas } = this.props.getEmpresas;
            return (
                <div className="table-wrapper">
                    <RctCollapsibleCard
                        heading="Cadastro de Empresas"
                        fullBlock
                        buttonAdd
                        onAddButtonClick={() => this.props.onAddButtonClick()}
                    >
                        <div className="table-responsive">
                            <Table>
                                <TableHead>
                                    <TableRow hover>
                                        <TableCell>Razão</TableCell>
                                        <TableCell>Fantasia</TableCell>
                                        <TableCell>CNPJ</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <Fragment>
                                        {empresas.map(
                                            ({
                                                id,
                                                idCpfCnpj,
                                                razao,
                                                fantasia,
                                                stEmpresa
                                            }) => (
                                                <TableRow hover key={id}>
                                                    <TableCell>
                                                        {razao}
                                                    </TableCell>
                                                    <TableCell>
                                                        {fantasia}
                                                    </TableCell>
                                                    <TableCell>
                                                        {idCpfCnpj}
                                                    </TableCell>
                                                    {stEmpresa === "ATIVO" ? (
                                                        <TableCell>
                                                            <Badge color="success">
                                                                Ativo
                                                            </Badge>
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell>
                                                            <Badge color="warning">
                                                                Cancelado
                                                            </Badge>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Tooltip title="Editar">
                                                            <IconButton
                                                                className="text-info"
                                                                aria-label="Delete"
                                                                onClick={() =>
                                                                    this.props.onEditGrid(
                                                                        id
                                                                    )
                                                                }
                                                            >
                                                                <i className="zmdi zmdi-edit"></i>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={
                                                                stEmpresa ===
                                                                "ATIVO"
                                                                    ? "Cancelar"
                                                                    : "Reativar"
                                                            }
                                                        >
                                                            <IconButton
                                                                className={
                                                                    stEmpresa ===
                                                                    "ATIVO"
                                                                        ? "text-dark"
                                                                        : "text-success"
                                                                }
                                                                onClick={() =>
                                                                    this.onConfirmStatus(
                                                                        stEmpresa,
                                                                        id
                                                                    )
                                                                }
                                                            >
                                                                {stEmpresa ===
                                                                "ATIVO" ? (
                                                                    <i className="zmdi zmdi-archive"></i>
                                                                ) : (
                                                                    <i className="zmdi zmdi-spellcheck"></i>
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </Fragment>
                                </TableBody>
                            </Table>
                        </div>
                    </RctCollapsibleCard>
                    <SweetAlert
                        warning={this.state.warning.show}
                        btnSize="sm"
                        show={this.state.warning.show}
                        showCancel
                        confirmBtnText={this.state.warning.confirmBtnText}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="success"
                        title={this.state.warning.title}
                        onConfirm={() =>
                            this.onChangeStatus(this.state.warning.id)
                        }
                        onCancel={() => this.onCancelStatus()}
                    >
                        {this.state.warning.description}
                    </SweetAlert>
                </div>
            );
        }
    }
}

export default compose(
    graphql(GET_EMPRESAS_CONS, { name: "getEmpresas" }),
    graphql(CHANGE_STATUS, {
        name: "changeStatus",
        options: {
            refetchQueries: [
                {
                    query: GET_EMPRESAS_CONS
                }
            ]
        }
    })
)(CadEmpresaConsulta);
