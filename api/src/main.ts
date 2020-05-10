import { establish_config } from './config';

const config = establish_config();

import { readFileSync } from 'fs';

import { ApolloServer, gql } from 'apollo-server-express';

import { Express, Request, Response } from 'express';

import { get_resolvers } from './gql/resolvers';
import { authentication_assert, prepare_deps } from './util/helpers';
import { logger } from './util/logger';
import { subscribe_lockdown, subscribe_signing_root_key, validate_registered_user_token } from './core/token';
import { AuthDirective } from './gql/directives';
import { RootCtx } from './types';

const __PORT__ = process.env.PORT || 3065;

(async () => {
    await subscribe_signing_root_key();
    await subscribe_lockdown();

    // tslint:disable-next-line:no-var-requires
    const express = require('express') as Express;

    const typeDefs = readFileSync('./schema/schema.graphql').toString();

    const depsFactory = prepare_deps();

    const server = new ApolloServer({
        typeDefs: gql(typeDefs),
        resolvers: get_resolvers(),
        schemaDirectives: {
            auth: AuthDirective,
        },
        async context({req}): Promise<RootCtx> {
            const userToken = req.headers['x-user-token'] as string | undefined;

            if (!userToken || userToken.constructor !== String) {
                return {
                    deps: depsFactory(null),
                };
            }

            const parsedUserToken = await validate_registered_user_token(
                userToken,
            );

            authentication_assert(
                // .. token has expired or wasn't valid to begin with
                parsedUserToken.isValid
                // .. the data inside the token is corrupt or empty
                && parsedUserToken.data,
                'User token is invalid.',
            );

            return {
                userContext: parsedUserToken.data!,
                userToken: parsedUserToken.userToken,
                deps: depsFactory(parsedUserToken.data ?? null),
            };
        },
        formatError: (err) => {
            logger.error(err);

            return {
                message: err.message,
                path: err.path,
                code: err.extensions!.code,
            };
        },
        debug: true,
        playground: true,
        introspection: true,
        tracing: config.env !== 'prod',
    });

    const app = (express as any)();

    app.get('/hc', (req: Request, res: Response) => {
        res.end('OK');
    });

    server.applyMiddleware({app, path: '/'});

    app.listen({
        port: __PORT__,
    }, () =>
        logger.info('Server is running on port %s', __PORT__),
    );
})();
