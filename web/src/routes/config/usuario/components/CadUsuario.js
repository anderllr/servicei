/**
 * CadUsuario Form Component
 */
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

//Component
import CadUsuarioDados from "./CadUsuarioDados";
import CadUsuarioConsulta from "./CadUsuarioConsulta";
import CadUsuarioEmpresa from "./CadUsuarioEmpresa";

// intl messages
import IntlMessages from "Util/IntlMessages";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class CadUsuario extends Component {
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
                            <CadUsuarioConsulta
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
                            <CadUsuarioDados
                                onComplete={() => this.setState({ value: 1 })}
                                onBack={() => this.setState({ value: 0 })}
                                id={this.state.id}
                            />
                        </TabContainer>
                    )}
                    {value === 2 && (
                        <TabContainer>
                            <CadUsuarioEmpresa
                                onChangeInfo={() => this.setState({ value: 2 })}
                            />
                        </TabContainer>
                    )}
                </div>
            </div>
        );
    }
}

export default withStyles(null, { withTheme: true })(CadUsuario);
