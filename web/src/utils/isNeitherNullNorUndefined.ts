export const isNeitherNullNorUndefined = <T>(t: T | null | undefined): t is NonNullable<T> =>
    t !== null && t !== undefined;
