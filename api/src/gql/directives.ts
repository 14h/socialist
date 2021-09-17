import {
    defaultFieldResolver,
    GraphQLArgument,
    GraphQLField,
    GraphQLFieldResolver,
    GraphQLInterfaceType,
    GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express';
import { RootCtx, UnpackedScopedToken } from '../types';

type GraphQLFieldDefinitionDetails = {
    objectType: GraphQLObjectType | GraphQLInterfaceType;
};

type TypeAuthInfo = {
    requiredPermissions: string[],
    privileged: boolean,
};

export class AuthDirective extends SchemaDirectiveVisitor {
    constructor(config: any) {
        super(config);
    }

    visitArgumentDefinition(
        arg: GraphQLArgument,
        details: GraphQLFieldDefinitionDetails & { field: GraphQLField<any, any> },
    ) {
        AuthDirective._saveField(details.field, null, [ [arg.name, this.args as TypeAuthInfo] ]);
        this._wrapField(details.field);
    }

    visitObject(type: GraphQLObjectType) {
        const typeFields = type.getFields();

        for (const fieldName of Object.keys(typeFields)) {
            const field = typeFields[fieldName];

            AuthDirective._saveField(field, this.args);
            this._wrapField(field);
        }
    }

    visitFieldDefinition(
        field: GraphQLField<any, any>,
        details: GraphQLFieldDefinitionDetails,
    ) {
        AuthDirective._saveField(field, this.args);
        this._wrapField(field);
    }

    _wrapField(field: GraphQLField<any, any> & { authWrapped?: boolean }) {
        if (field.authWrapped) {
            return;
        }

        field.authWrapped = true;

        const actualResolver = field.resolve || defaultFieldResolver;

        field.resolve = async (...args: Parameters<GraphQLFieldResolver<any, RootCtx, any>>) => {
            const authMeta = (field as any).fieldPermissions;

            const resolveArgs = args[1];
            const ctx = args[2];

            const hasAuthDirective =
                field.astNode
                    ?.directives
                    ?.some(directive =>
                        directive.name.value === 'auth',
                    );

            // TODO: FIX THIS MESS

            return actualResolver(...args);

            const needsPrivileged = authMeta.privileged;
            const needsSpecialPermissions = authMeta.requiredPermissions.length !== 0;

            const needsFurtherChecks = needsPrivileged || needsSpecialPermissions;

            if (
                !hasAuthDirective
                && !needsFurtherChecks
            ) {
                return actualResolver(...args);
            }

            if (!ctx.userContext) {
                throw new ForbiddenError(
                    `field '${field.name}' requires user authentication.`,
                );
            }

            AuthDirective._reconcileAuthRequirements(
                authMeta,
                ctx.userContext!,
                `Field '${field.name}' requires special privileges.`,
            );

            for (const [argName, argRequirements] of (field as any).argumentPermissions) {
                if (resolveArgs[argName] !== undefined) {
                    AuthDirective._reconcileAuthRequirements(
                        argRequirements,
                        ctx.userContext!,
                        `Argument '${argName}' on field '${field.name}' requires special privileges.`,
                    );
                }
            }

            return actualResolver(...args);
        };
    }

    static _reconcileAuthRequirements(
        req: TypeAuthInfo,
        ctx: UnpackedScopedToken,
        mismatchMessage: string,
    ) {
        if (
            req.privileged && ctx.privileged !== 1
        ) {
            throw new ForbiddenError(mismatchMessage);
        }
    }

    private static _saveField(
        field: GraphQLField<any, any>,
        args: SchemaDirectiveVisitor['args'] | null,
        specialArgs?: [string, TypeAuthInfo][],
    ) {
        const previouslyKnown: Partial<TypeAuthInfo> = (field as any).fieldPermissions || {};

        const fieldPermissions =
            (args && args.perms)
                ? [
                    ...(args.perms || []),
                    ...(previouslyKnown.requiredPermissions || []),
                ]
                : previouslyKnown.requiredPermissions || [];

        const previousArgPerms = (field as any).argumentPermissions;

        (field as any).argumentPermissions =
            specialArgs
                ? [
                    ...(specialArgs || []),
                    ...(previousArgPerms || []),
                ]
                : previousArgPerms || [];

        (field as any).fieldPermissions = {
            privileged: (args?.privileged || previouslyKnown.privileged) ?? false,
            requiredPermissions: fieldPermissions,
        };
    }
}
