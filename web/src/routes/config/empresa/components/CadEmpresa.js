/**
 * CadEmpresa Form Component
 */
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

//Component
import CadEmpresaDados from "./CadEmpresaDados";
import CadEmpresaConsulta from "./CadEmpresaConsulta";
import CadEmpresaFiscal from "./CadEmpresaFiscal";

// intl messages
import IntlMessages from "Util/IntlMessages";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class CadEmpresa extends Component {
    state = {
        value: 0,
        id: ""
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { value } = this.state;
        return (
            <div className="checkout-form-wrap">
                <div>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab
                                disabled
                                label={
                                    <IntlMessages id="empresa.abaconsulta" />
                                }
                            />
                            <Tab
                                disabled
                                label={<IntlMessages id="empresa.abadados" />}
                            />
                            <Tab
                                disabled
                                label={<IntlMessages id="empresa.abafiscal" />}
                            />
                        </Tabs>
                    </AppBar>
                    {value === 0 && (
                        <TabContainer>
                            <CadEmpresaConsulta
                                onEditGrid={id =>
                                    this.setState({ value: 1, id })
                                }
                                onAddButtonClick={() =>
                                    this.setState({ value: 1, id: null })
                                }
                            />
                        </TabContainer>
                    )}
                    {value === 1 && (
                        <TabContainer>
                            <CadEmpresaDados
                                onComplete={() => this.setState({ value: 1 })}
                                onBack={() => this.setState({ value: 0 })}
                                id={this.state.id}
                            />
                        </TabContainer>
                    )}
                    {value === 2 && (
                        <TabContainer>
                            <CadEmpresaFiscal
                                onChangeInfo={() => this.setState({ value: 2 })}
                            />
                        </TabContainer>
                    )}
                </div>
            </div>
        );
    }
}

export default withStyles(null, { withTheme: true })(CadEmpresa);
