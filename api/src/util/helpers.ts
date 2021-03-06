import { ForbiddenError, ValidationError, AuthenticationError } from 'apollo-server-express';
import { randomBytes } from 'crypto';
import { uuid } from 'uuid-v4-wasm';

import { Database, get_redis_client } from '../core/db';
import { Rights } from '../res/rights';
import { User } from '../res/user';
import { Survey } from '../res/survey';
import { Org } from '../res/organization';

import { Nullable, ResourceDeps, ResourceType, UnpackedScopedToken, ValidationDeps } from '../types';
import { logger } from './logger';
import { buildAuditEmitter } from '../core/rootAuditor';
import slugify from 'slugify';
import { Translation } from '../res/translation';

export const create_random_key = () => {
    return randomBytes(64);
};

export const validation_assert = (
    cond: any,
    msg: string,
) => {
    if (!cond) {
        throw new ValidationError(msg);
    }
};

export const authentication_assert = (
    cond: any,
    msg: string,
) => {
    if (!cond) {
        throw new AuthenticationError(msg);
    }
};

export const forbidden_assert = (
    cond: any,
    msg: string,
) => {
    if (!cond) {
        throw new ForbiddenError(msg);
    }
};

export const validation_deps = (): ValidationDeps => ({
    gqlEnsureNonEmpty(
        term: string,
        label = 'string',
    ) {
        validation_assert(
            term !== '',
            `Cannot possibly work with an empty ${label}.`,
        );
    },
});

export const prepare_deps = (): (userContext: UnpackedScopedToken | null) =>
    ResourceDeps => {
    const db = new Database({
        get_redis_client,
    });

    const resDeps = {} as ResourceDeps;

    const auditEmitter = buildAuditEmitter();

    const rights = new Rights(resDeps);

    Object.assign(
        resDeps,
        {
            db,
            auditEmitter,

            rights,

            uuid,

            validation: validation_deps(),
        } as any,
    );

    return (
        userContext: UnpackedScopedToken | null,
    ) => {
        const ctxDeps = {
            userContext,
        } as ResourceDeps;

        const user = new User(ctxDeps);
        const survey = new Survey(ctxDeps);
        const org = new Org(ctxDeps);
        const translation = new Translation(ctxDeps);

        [user, survey, org, translation].forEach(
            res =>
                Object.assign(res, { userContext }),
        );

        Object.assign(
            ctxDeps,
            resDeps,
            {
                survey,
                user,
                org,
                translation,
            },
        );

        return ctxDeps;
    };
};

export const resolve_res_params = async (
    type: ResourceType,
    params: {
        email?: Nullable<string>,
        userId?: Nullable<string>,
        orgName?: Nullable<string>,
        orgId?: Nullable<string>,
        surveyName?: Nullable<string>,
        surveyId?: Nullable<string>,
        resId?: Nullable<string>,
        resName?: Nullable<string>,
    },
    deps: ResourceDeps,
): Promise<string> => {
    let resId: Nullable<string>;

    if (type === ResourceType.USER) {
        resId = params.userId!;

        if (params.email) {
            resId = await deps.user.resolve_email(
                params.email!,
            );
        }

        validation_assert(
            await deps.user.exists(resId!),
            'User not found.',
        );
    }

    if (type === ResourceType.ORG) {
        resId = params.orgId! || params.resId!;
        console.log("-> here",resId, await deps.org.exists(resId!));

        validation_assert(
            await deps.org.exists(resId!),
            'Organization not found.',
        );
    }

    if (type === ResourceType.SURVEY) {
        resId = params.surveyId! || params.resId!;

        validation_assert(
            await deps.survey.exists(resId!),
            'Survey not found.',
        );
    }

    if (!resId!) {
        logger.error(
            'Unexpected error: failed to correctly resolve resource alias',
            type,
            params,
        );

        throw new ValidationError(
            'Could not resolve resource alias.',
        );
    }

    return resId!;
};

export const remove_duplicates_by = (
    dirtyArray: { [key: string]: any }[],
    uniqKey: string,
) => {
    validation_assert(
        Array.isArray(dirtyArray) && uniqKey,
        'Cannot possibly select unique ids from given arguments.',
    );

    return Array.from(dirtyArray.reduce((
        acum,
        value,
    ) => {
        return acum.has(value[uniqKey]) ? acum : acum.set(value[uniqKey], value);
    }, new Map()).values());
};

export const build_slug = (string: string): string => (
    slugify(
        string.replace(/[_|*+~.\\\/()\[\]{}!:,=]/g, '-'),
        {
            replacement: '-',
            lower: true,
            strict: true,
            // remove: /[*+~.()\[\]{}'"!:@,]/g,
        }
    ).replace(/^-|-$/g, '') // strip trailing/leading dashes
);
