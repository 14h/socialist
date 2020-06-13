import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

import { OrgEnvelope } from '../res/organization';
import { permissionMapping } from '../util/permissionMapper';
import { Rights, UserRoles } from '../res/rights';
import { User, UserDataWithoutAuthKey, UserEnvelope } from '../res/user';
import {
    authentication_assert,
    forbidden_assert,
    validation_assert,
    resolve_res_params,
    remove_duplicates_by,
} from '../util/helpers';

import {
    SurveyQuery,
    IdSrc, LazyRelatedEntitySrc,
    Nullable,
    OrgQuery, ResourceQuery,
    ResourceType,
    RoleSrc,
    RootCtx,
    UserCredInput, UserMultiQuery,
    UserQuery,
    UserRelatedEntitySrc,
} from '../types';
import { validate_registered_user_token } from '../core/token';

export const get_resolvers = () => {
    const resolvers = {
        Rights: {
            perms: (source: RoleSrc) =>
                permissionMapping(source.roles),
        },

        UserRelatedEntities: {
            surveys: (source: UserRelatedEntitySrc) =>
                source.surveyIds.map((entityId) => ({
                    id: entityId,
                }))
            ,
            effectiveSurveys: async (
                source: UserRelatedEntitySrc,
                _: any,
                ctx: RootCtx,
            ) => {
                const directSurveyIds = source.surveyIds.map((entityId) => ({
                    id: entityId,
                }));

                const orgSurveyIds = await Promise.all(
                    source.orgIds.map((orgId) =>
                        resolvers.Org.surveys({
                            id: orgId,
                        }, _, ctx),
                    ),
                );

                return remove_duplicates_by(
                    directSurveyIds.concat(orgSurveyIds.flat()),
                    'id',
                );
            },
            orgs: (source: UserRelatedEntitySrc) =>
                source.orgIds.map((entityId) => ({
                    id: entityId,
                })),
        },

        OrgRelatedEntities: {
            async surveys(
                source: LazyRelatedEntitySrc,
                _: any,
                ctx: RootCtx,
            ) {
                return resolvers.Org.surveys(source, _, ctx);
            },
            async users(
                source: LazyRelatedEntitySrc,
                _: any,
                ctx: RootCtx,
            ) {
                const users = await ctx.deps.org.get_all_users(
                    source.id,
                ) || [];

                return users.map(([entityId]) => ({
                    id: entityId,
                }));
            },
        },

        SurveyQuestionMultiReplyOption: {
            __resolveType: () => {},
        },

        SurveyQuestion: {
            __resolveType: () => {},
        },

        SurveyRelatedEntities: {
            async users(
                source: LazyRelatedEntitySrc,
                _: any,
                ctx: RootCtx,
            ) {
                const users = await ctx.deps.survey.get_all_users(
                    source.id,
                ) || [];

                return users.map(([entityId]) => ({
                    id: entityId,
                }));
            },
        },

        User: {
            config(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.user.get_config(source.id);
            },
            async flags(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.user.get_flags(source.id);
            },
            meta(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.user.get_meta(source.id);
            },
            related(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.user.get_related(source.id);
            },
            async rights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return {
                    roles: await ctx.deps.user.get_roles(source.id),
                };
            },
        },

        Survey: {
            config(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.survey.get_config(source.id);
            },
            async flags(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.survey.get_flags(source.id);
            },
            meta(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.survey.get_meta(source.id);
            },
            async org(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return {
                    id: await ctx.deps.survey.get_org_id(source.id),
                };
            },
            async rights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return resolvers.Survey.viewerRights(
                    source, _, ctx,
                );
            },
            async viewerRights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return {
                    roles: await ctx.deps.survey.get_effective_roles(
                        source.id,
                        ctx.userRefId!,
                    ),
                };
            },
            async userRights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                const rights = await ctx.deps.survey.get_all_users(
                    source.id,
                );

                return rights.map(([userId, roles]) => ({
                    user: { id: userId },
                    rights: { roles },
                }));
            },
            related: (
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) => source,
        },

        Org: {
            config(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.org.get_config(source.id);
            },
            flags(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.org.get_flags(source.id);
            },
            async surveys(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return (await ctx.deps.org.get_surveys(source.id)).map(
                    (id) => ({ id }),
                );
            },
            meta(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return ctx.deps.org.get_meta(source.id);
            },
            rights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return resolvers.Org.viewerRights(
                    source, _, ctx,
                );
            },
            async viewerRights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                return {
                    roles: await ctx.deps.org.get_effective_roles(
                        source.id,
                        ctx.userRefId!,
                    ),
                };
            },
            async userRights(
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) {
                const rights = await ctx.deps.org.get_all_users(
                    source.id,
                );

                return rights.map(([userId, roles]) => ({
                    user: { id: userId },
                    rights: { roles },
                }));
            },
            related: (
                source: IdSrc,
                _: any,
                ctx: RootCtx,
            ) => source,
        },

        LoginChip: {
            chip(source: { userId: string }) {
                return User.create_login_chip(
                    source.userId,
                );
            },
            userToken(source: { userId: string }) {
                return User.create_readonly_user_token(
                    source.userId,
                );
            },
        },

        SearchResult: {
            orgs: (source: UserRelatedEntitySrc) =>
                source.orgIds.map((entityId) => ({
                    id: entityId,
                })),
            users: async (source: UserRelatedEntitySrc) =>
                source.userIds.map((entityId) => ({
                    id: entityId,
                })),
            surveys: async (source: UserRelatedEntitySrc) =>
                source.surveyIds.map((entityId) => ({
                    id: entityId,
                })),
        },

        Query: {
            async org(
                _source: {},
                args: OrgQuery & UserQuery,
                ctx: RootCtx,
            ) {
                if (args.userId || args.email) {
                    ctx.userRefId = await resolve_res_params(
                        ResourceType.USER,
                        args,
                        ctx.deps,
                    );
                } else {
                    ctx.userRefId = ctx.userContext?.userId;
                }

                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                return {
                    id: orgId,
                };
            },
            async survey(
                _source: {},
                args: SurveyQuery & UserQuery,
                ctx: RootCtx,
            ) {
                if (args.userId || args.email) {
                    ctx.userRefId = await resolve_res_params(
                        ResourceType.USER,
                        args,
                        ctx.deps,
                    );
                } else {
                    ctx.userRefId = ctx.userContext?.userId;
                }

                const surveyId = await resolve_res_params(
                    ResourceType.SURVEY,
                    args,
                    ctx.deps,
                );

                return {
                    id: surveyId,
                };
            },
            async user(
                _source: {},
                args: UserQuery,
                ctx: RootCtx,
            ) {
                const contextUserId = ctx.userContext!.userId;

                if (args.userId || args.email) {
                    const userRefId = await resolve_res_params(
                        ResourceType.USER,
                        args,
                        ctx.deps,
                    );

                    ctx.userRefId = userRefId;

                    if (contextUserId !== userRefId) {
                        const subjectAndViewerRelated =
                            await ctx.deps.user.check_users_related(
                                contextUserId,
                                userRefId,
                            );

                        const isPrivileged = ctx.userContext!.privileged === 1;

                        forbidden_assert(
                            isPrivileged || subjectAndViewerRelated,
                            'Viewer is neither related nor privileged.',
                        );
                    }

                    return {
                        id: userRefId,
                    };
                }

                ctx.userRefId = contextUserId;

                return {
                    id: ctx.userContext!.userId,
                };
            },
            user_multi(
                _source: {},
                args: UserMultiQuery,
                ctx: RootCtx,
            ) {
                if (args.users.length === 0) {
                    return [];
                }

                {
                    for (const userQuery of args.users) {
                        validation_assert(
                            userQuery.userId || userQuery.email,
                            `Every user entry must include either an email address or userId.`,
                        );
                    }
                }

                const contextUserId = ctx.userContext!.userId;

                return Promise.all(
                    args.users.map(async userQuery => {
                        const id = userQuery.userId || userQuery.email;

                        const userRefId = await resolve_res_params(
                            ResourceType.USER,
                            userQuery,
                            ctx.deps,
                        );

                        ctx.userRefId = userRefId;

                        if (contextUserId !== userRefId) {
                            const subjectAndViewerRelated =
                                await ctx.deps.user.check_users_related(
                                    contextUserId,
                                    userRefId,
                                );

                            const isPrivileged = ctx.userContext!.privileged === 1;

                            forbidden_assert(
                                isPrivileged || subjectAndViewerRelated,
                                `Viewer is neither privileged nor related to ${id}.`,
                            );
                        }

                        return {
                            id: userRefId,
                        };
                    }),
                );
            },
        },

        Mutation: {
            // User handshake

            async createLoginChip(
                _source: {},
                args: UserCredInput,
                ctx: RootCtx,
            ) {
                const userId = await ctx.deps.user.resolve_email(args.creds.email);

                authentication_assert(
                    userId,
                    'Invalid credentials.',
                );

                await ctx.deps.user.check_password_strict(
                    userId!,
                    args.creds.password,
                );

                return {
                    userId,
                };
            },

            redeemLoginChip(
                _source: {},
                args: { chip: string },
                ctx: RootCtx,
            ) {
                return ctx.deps.user.redeem_login_chip(
                    args.chip,
                );
            },

            async revokeUserToken(
                _source: {},
                args: { userToken: string },
            ) {
                const parsedUserToken = await validate_registered_user_token(
                    args.userToken,
                    // the following parameter enforces the token to be
                    // dropped before returning the contained data
                    true,
                );

                return parsedUserToken.isValid;
            },

            async reissueUserToken(
                _source: {},
                _: {},
                ctx: RootCtx,
            ) {
                validation_assert(
                    ctx.userToken ?? false,
                    'Internal error: could not locate user token.',
                );

                const parsedUserToken = await validate_registered_user_token(
                    ctx.userToken!,
                    // the following parameter enforces the token to be
                    // dropped before returning the contained data
                    true,
                );

                forbidden_assert(
                    parsedUserToken.data?.readonly
                    || parsedUserToken.data?.chip,
                    'Forbidden use of login chip or readonly token. Token has been invalidated.',
                );

                forbidden_assert(
                    parsedUserToken.isValid
                    && (parsedUserToken.data?.userId ?? false),
                    'User token is invalid or has expired.',
                );

                const loginChip = await User.create_login_chip(
                    parsedUserToken.data?.userId!,
                );

                return ctx.deps.user.redeem_login_chip(
                    loginChip,
                );
            },

            // Operations

            //// User

            async createUser(
                _source: {},
                args: UserCredInput,
                ctx: RootCtx,
            ): Promise<UserEnvelope> {
                validation_assert(
                    !await ctx.deps.user.resolve_email(args.creds.email),
                    'User already exists.',
                );

                const userEnvelope = await ctx.deps.user.create(
                    {
                        email: args.creds.email,
                        password: args.creds.password,
                        firstname: args.creds.firstname,
                        lastname: args.creds.lastname,
                    },
                );

                validation_assert(
                    userEnvelope !== null,
                    'User could not be created.',
                );

                return userEnvelope;
            },

            async deleteUser(
                _source: {},
                args: UserQuery,
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.delete(userId);
            },

            async setUserMeta(
                _source: {},
                args: UserQuery & { meta: Partial<UserDataWithoutAuthKey> },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.update(userId, args.meta);
            },

            async setUserConfig(
                _source: {},
                args: UserQuery & { config: any },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.set_config(userId, args.config);
            },

            async updateUserPassword(
                _source: {},
                args: UserQuery & { newPassword: string },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.update_password(
                    userId,
                    args.newPassword,
                );
            },

            async addUserFlags(
                _source: {},
                args: UserQuery & { flags: string[] },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.add_flags(
                    userId,
                    args.flags,
                );
            },

            async removeUserFlags(
                _source: {},
                args: UserQuery & { flags: string[] },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                return ctx.deps.user.remove_flags(
                    userId,
                    args.flags,
                );
            },

            async addResourceFlags(
                _source: {},
                args: ResourceQuery
                    & {
                    type: string,
                    flags: string[],
                },
                ctx: RootCtx,
            ): Promise<boolean> {
                const targetRes =
                    args.type === 'ORG'
                        ? ctx.deps.org
                        : ctx.deps.survey;

                const resId = await resolve_res_params(
                    targetRes.type,
                    args,
                    ctx.deps,
                );

                return targetRes.add_flags(
                    resId,
                    args.flags,
                );
            },

            async removeResourceFlags(
                _source: {},
                args: ResourceQuery
                    & {
                    type: string,
                    flags: string[],
                },
                ctx: RootCtx,
            ): Promise<boolean> {
                const targetRes =
                    args.type === 'ORG'
                        ? ctx.deps.org
                        : ctx.deps.survey;

                const resId = await resolve_res_params(
                    targetRes.type,
                    args,
                    ctx.deps,
                );

                return targetRes.remove_flags(
                    resId,
                    args.flags,
                );
            },

            async addUserRoles(
                _source: {},
                args: UserQuery & { roles: string[] },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                Rights.verify_roles(args.roles);

                const oldRoles = await ctx.deps.user.get_roles(userId);

                const newRoles =
                    Array.from(
                        new Set(
                            [
                                ...oldRoles,
                                ...args.roles,
                            ],
                        ),
                    );

                return ctx.deps.user.set_roles(
                    userId,
                    newRoles as unknown as UserRoles,
                );
            },

            async removeUserRoles(
                _source: {},
                args: UserQuery & { roles: string[] },
                ctx: RootCtx,
            ): Promise<boolean> {
                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                Rights.verify_roles(args.roles);

                const oldRoles = await ctx.deps.user.get_roles(userId);

                const newRoles = oldRoles.filter((role) =>
                    !args.roles.includes(role),
                );

                return ctx.deps.user.set_roles(
                    userId,
                    newRoles as unknown as UserRoles,
                );
            },

            async addResourceUserRoles(
                source: {},
                args: UserQuery
                    & ResourceQuery
                    & {
                    type: string,
                    roles: string[],
                },
                ctx: RootCtx,
            ): Promise<boolean> {
                const targetRes =
                    args.type === 'ORG'
                        ? ctx.deps.org
                        : ctx.deps.survey;

                const resId = await resolve_res_params(
                    targetRes.type,
                    args,
                    ctx.deps,
                );

                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                Rights.verify_roles(args.roles);

                const oldRoles = await targetRes.get_roles(
                    resId,
                    userId,
                );

                const newRoles =
                    Array.from(
                        new Set(
                            [
                                ...oldRoles,
                                ...args.roles,
                            ],
                        ),
                    );

                return targetRes.set_roles(
                    resId,
                    userId,
                    newRoles as unknown as UserRoles,
                );
            },

            async removeResourceUserRoles(
                source: {},
                args: UserQuery
                    & ResourceQuery
                    & {
                    type: string,
                    roles: string[],
                },
                ctx: RootCtx,
            ): Promise<boolean> {
                if (args.type === 'USER') {
                    return resolvers.Mutation.addUserRoles(
                        source,
                        {
                            userId: args.resId,
                            roles: args.roles,
                        },
                        ctx,
                    );
                }

                const targetRes =
                    args.type === 'ORG'
                        ? ctx.deps.org
                        : ctx.deps.survey;

                const resId = await resolve_res_params(
                    targetRes.type,
                    args,
                    ctx.deps,
                );

                const userId = await resolve_res_params(
                    ResourceType.USER,
                    args,
                    ctx.deps,
                );

                Rights.verify_roles(args.roles);

                const oldRoles = await targetRes.get_roles(
                    resId,
                    userId,
                );

                const newRoles = oldRoles.filter((role) =>
                    !args.roles.includes(role),
                );

                return targetRes.set_roles(
                    resId,
                    userId,
                    newRoles as unknown as UserRoles,
                );
            },

            //// Organization

            async createOrganization(
                _source: {},
                args: { orgName: string },
                ctx: RootCtx,
            ): Promise<OrgEnvelope> {
                const orgEnvelope = await ctx.deps.org.create(
                    args.orgName,
                );

                validation_assert(
                    orgEnvelope !== null,
                    'Organization could not be created.',
                );

                return orgEnvelope!;
            },

            async deleteOrganization(
                _source: {},
                args: OrgQuery,
                ctx: RootCtx,
            ): Promise<boolean> {
                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                return ctx.deps.org.delete(orgId);
            },

            async renameOrganization(
                _source: {},
                args: OrgQuery & { newName: string },
                ctx: RootCtx,
            ): Promise<boolean> {
                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                return ctx.deps.org.rename(
                    orgId,
                    args.newName,
                );
            },

            async setOrgConfig(
                _source: {},
                args: OrgQuery & { config: any },
                ctx: RootCtx,
            ): Promise<boolean> {
                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                return ctx.deps.org.set_config(orgId, args.config);
            },

            //// Survey

            async createSurvey(
                _source: {},
                args: OrgQuery & { surveyName: string },
                ctx: RootCtx,
            ): Promise<OrgEnvelope> {
                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                const surveyEnvelope = await ctx.deps.survey.create(
                    args.surveyName,
                    orgId,
                );

                validation_assert(
                    surveyEnvelope !== null,
                    'Survey could not be created.',
                );

                return surveyEnvelope!;
            },

            async deleteSurvey(
                _source: {},
                args: SurveyQuery,
                ctx: RootCtx,
            ): Promise<boolean> {
                const surveyId = await resolve_res_params(
                    ResourceType.SURVEY,
                    args,
                    ctx.deps,
                );

                return ctx.deps.survey.delete(
                    surveyId,
                );
            },

            async renameSurvey(
                _source: {},
                args: OrgQuery & { newName: string },
                ctx: RootCtx,
            ): Promise<boolean> {
                const surveyId = await resolve_res_params(
                    ResourceType.SURVEY,
                    args,
                    ctx.deps,
                );

                return ctx.deps.survey.rename(
                    surveyId,
                    args.newName,
                );
            },

            async moveSurvey(
                _source: {},
                args: SurveyQuery & OrgQuery,
                ctx: RootCtx,
            ): Promise<boolean> {
                const surveyId = await resolve_res_params(
                    ResourceType.SURVEY,
                    args,
                    ctx.deps,
                );

                const orgId = await resolve_res_params(
                    ResourceType.ORG,
                    args,
                    ctx.deps,
                );

                return ctx.deps.survey.move(
                    surveyId,
                    orgId,
                );
            },

            async setSurveyConfig(
                _source: {},
                args: SurveyQuery & { config: any },
                ctx: RootCtx,
            ): Promise<boolean> {
                const surveyId = await resolve_res_params(
                    ResourceType.SURVEY,
                    args,
                    ctx.deps,
                );

                return ctx.deps.survey.set_config(surveyId, args.config);
            },
        },

        // custom scalars
        // AnyJSON: GraphQLJSON,
        Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Date',
            parseValue(value: number | string | null): Nullable<Date> {
                return value ? new Date(value) : null;
            },
            serialize(value: number | null): Nullable<number> {
                return value;
            },
            parseLiteral(ast: ValueNode) {
                if (ast.kind === Kind.INT) {
                    return new Date(ast.value);
                }

                return null;
            },
        }),
    };

    return resolvers;
};
