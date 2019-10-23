import React, { Component } from "react";

//Components
import CadUsuario from "./components/CadUsuario";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

class Usuario extends Component {
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
                                <CadUsuario />
                            </div>
                        </div>
                    </RctCardContent>
                </RctCard>
            </div>
        );
    }
}
export default Usuario;
