const perms = {
    admin: ['admin'],
    editor: ['edit', 'create'],
    publisher: ['publish', 'delete', 'unpublish'],
    read: ['read'],
};

export const roleMap = new Map([
    ['admin', [ // includes all permissions
        'admin',
        ...perms.editor,
        ...perms.publisher,
        ...perms.read,
    ]],
    ['editor', [ // includes read
        'edit', 'create',
        ...perms.read,
    ]],
    ['publisher', [ // includes read
        'publish', 'delete', 'unpublish',
        ...perms.read,
    ]],
    ['read', ['read']],
]);

export type Topology = [string[], string[], string[]];

const isSubset = (arr: string[], subarr: string[]): boolean => {
    if (subarr.length > arr.length) {
        return false;
    }

    for (let j = 0; j < subarr.length; ++j) {
        if (arr.indexOf(subarr[j]) === -1) {
            return false;
        }
    }

    return true;
};

export function roleMapping(permissions: string[]): string[] {
    const mappedRoles: string[] = [];

    for (const role of roleMap.entries()) {
        if (isSubset(permissions, role[1])) {
            mappedRoles.push(role[0]);
        }
    }

    return mappedRoles;
}

export function permissionMapping(roles: string[]): string[] {
    const mappedPermissions: string[] = [];

    for (let i = 0; i < roles.length; ++i) {
        const rolePerms = roleMap.get(roles[i]);

        if (!rolePerms) {
            continue;
        }

        [].push.apply(
            mappedPermissions,
            rolePerms as any,
        );
    }

    return Array.from(new Set(mappedPermissions));
}

export function permissionProjection(topology: Topology): string[] {
    return [...new Set([].concat.apply([], topology as any))];
}
