export const PGuard = async <T>(fn: () => Promise<T>) => {
    const val: { v?: T | null } = {};
    let err: number;

    try {
        val.v = await fn();
    } catch {
        err = 1;
    }

    return {
        unwrap_or: (rval: T): T => err ? rval : val.v!,
        unwrap (): T {
            if (err) {
                throw err;
            }

            return val.v!;
        },
        drop: () => (val.v = null),
    };
};
