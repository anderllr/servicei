/**
 * Checkout Page
 */
import React, { Component } from "react";

//Components
import CadEmpresa from "./components/CadEmpresa";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

class Empresa extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="checkout-wrap">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.empresa" />}
                    match={match}
                />
                <RctCard customClasses="overflow-hidden">
                    <RctCardContent noPadding>
                        <div className="row no-gutters">
                            <div className="col-lg-12 col-md-6 col-sm-12">
                                <CadEmpresa />
                            </div>
                        </div>
                    </RctCardContent>
                </RctCard>
            </div>
        );
    }
}
export default Empresa;
