import { assert } from 'chai';

export const assertRejects = async <T>(promise: () => Promise<T>, errType: any) => {
    try {
        await promise();

        assert(null as never, 'Expected promise to be rejected.');
    } catch(err) {
        assert(err instanceof errType);

        return err;
    }
};

export const assertResolves = async <T>(promise: () => Promise<T>) => {
    try {
        return await promise();
    } catch {
        assert(null as never, 'Expected promise to be resolved.');
    }

    return null as never;
};
