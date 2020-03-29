/*
 * Allows the creation of a lazily resolved promise.
 *
 * Exploits the fact that resolve and reject can be
 * leaked out of the promise constructor and be called
 * lazily.
 *
 * This allows for APIs where a promise is returned
 * and reject / resolve logic is handled elsewhere.
 */

export const deferred = <P>(): {
    reject: () => void,
    resolve: (val: P) => void,
    promise: Promise<P>
} => {
    let reject = null;
    let resolve = null;

    const promise: Promise<P> = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        // @ts-ignore
        reject,
        // @ts-ignore
        resolve,
        promise,
    };
};
