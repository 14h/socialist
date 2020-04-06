export function assertNonNullable<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected ${value} to be non-nullable.`);
    }
}

export function assertNullable<T>(value: T | null | undefined): asserts value is NonNullable<T> {
    if (value !== undefined && value !== null) {
        throw new Error(`Expected ${value} to be nullable.`);
    }
}

export function assertTrue(value: boolean | null | undefined): asserts value is true {
    if (value !== true) {
        throw new Error(`Expected ${value} to be true.`);
    }
}
