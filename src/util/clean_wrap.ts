export const PGuard = async <T>(fn: () => Promise<T>) => {
    let val: { v?: T | null, } = {};
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

export const PNullGuard = async <T>(fn: () => Promise<T>) =>
    (await PGuard<T | null>(
        fn,
    )).unwrap_or(null);
