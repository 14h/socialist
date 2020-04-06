import React from 'react';
import { Route } from "react-router-dom";
import { TRouteConfiguration } from "../routes/routeConfiguration";
import { TRouteComponentProps } from '../routes/routeComponentProps';
import { AccessBoundary } from '../connectedComponents/accessBoundary';
import { BreadcrumbsContextProvider } from '../contexts/breadcrumbsContext';

export const buildRoutes = (routeConfigurations: ReadonlyArray<TRouteConfiguration>) =>
    routeConfigurations.map(({ path, loggedIn, userScopedAdmin, component }, key) => {
        const renderRoute = (routeComponentProps: TRouteComponentProps) => {
            const renderAccessBoundary = () => <BreadcrumbsContextProvider
                path={path}
                routeParams={routeComponentProps.match.params}
                children={React.createElement(component, routeComponentProps)}
            />;

            return <AccessBoundary
                loggedIn={loggedIn}
                userScopedAdmin={userScopedAdmin}
                render={renderAccessBoundary}
            />
        };

        return <Route key={key} path={path} exact={true} render={renderRoute} />;
    });
