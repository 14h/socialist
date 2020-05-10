import * as events from 'events';
import { InternalResourceType, ResourceDeps, ResourceType, UnpackedScopedToken } from '../types';

export type AuditOp<T> = [
    UnpackedScopedToken | null,
    ResourceType | InternalResourceType,
    keyof T,
    any[],
];

export type TAuditEmitter = Omit<Omit<events.EventEmitter, 'emit'>, 'on'> & {
    emit<T>(event: 'tx', op: AuditOp<T>): boolean;
    emit(event: 'flush'): boolean;

    on<T>(event: 'tx', fn: (op: AuditOp<T>) => void): TAuditEmitter;
    on(event: 'flush', fn: () => void): TAuditEmitter;
};

export const buildAuditEmitter = () =>
    new events.EventEmitter() as TAuditEmitter;

interface TPrototype<T> {
    readonly type?: ResourceType | InternalResourceType;

    prototype?: T;
}

export class RootAuditor<T extends TPrototype<T>> {
    protected readonly userContext?: UnpackedScopedToken | null;
    protected _deps!: ResourceDeps;

    protected attachAuditor(
        baseClass: TPrototype<T>,
        ctx: T & RootAuditor<T>,
    ) {
        const propNames: ReadonlyArray<keyof T> = Object.getOwnPropertyNames(baseClass.prototype) as any;

        for (const item of propNames) {
            // protect access to original method
            // by isolating it into this closure
            const auditorFence = ctx[item];

            if (!(auditorFence instanceof Function)) {
                continue;
            }

            const methodOverride = (...args: any[]) => {
                this._deps
                    .auditEmitter
                    .emit(
                        'tx',
                        [
                            ctx.userContext!,
                            ctx.type!,
                            item,
                            args,
                        ],
                    );

                return auditorFence.apply(ctx, args);
            };

            ctx[item] = methodOverride as any;

            // restore original method name
            Object.defineProperty(
                ctx[item],
                'name',
                {
                    writable: false,
                    value: item,
                },
            );
        }
    }
}
