/**
 * Ecommerce Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
// async components
import {
    AsyncShoplistComponent,
    AsyncShopGridComponent,
    AsyncInvoiceComponent,
    AsyncShopComponent,
    AsyncCartComponent,
    AsyncEmpresaComponent,
    AsyncUsuarioComponent
} from "Components/AsyncComponent/AsyncComponent";

const Config = ({ match }) => (
    <div className="content-wrapper">
        <Helmet>
            <title>Configurações do Sistema</title>
            <meta name="description" content="Servicei - Gestão Simplificada" />
        </Helmet>
        <Switch>
            <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/shop-list`}
            />
            <Route
                path={`${match.url}/shop-list`}
                component={AsyncShoplistComponent}
            />
            <Route
                path={`${match.url}/shop-grid`}
                component={AsyncShopGridComponent}
            />
            <Route
                path={`${match.url}/invoice`}
                component={AsyncInvoiceComponent}
            />
            <Route path={`${match.url}/shop`} component={AsyncShopComponent} />
            <Route path={`${match.url}/cart`} component={AsyncCartComponent} />
            <Route
                path={`${match.url}/empresa`}
                component={AsyncEmpresaComponent}
            />
                        <Route
                path={`${match.url}/usuario`}
                component={AsyncUsuarioComponent}
            />
        </Switch>
    </div>
);

export default Config;
