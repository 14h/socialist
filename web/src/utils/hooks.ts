import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

  
type THookName = string;

export type THookData = {
    [k: string]: any;
};

type THook<D extends THookData> = (
    data?: D,
) => void;

type THookEnvelope<D> = NonNullable<THook<D>>;

export class HookRegistry {
    private _hooks: Map<
        THookName,
        ReadonlyArray<THookEnvelope<any>>
    >;

    constructor() {
        this._hooks = new Map();
    }

    public register<D>(
        name: THookName,
        hook: NonNullable<THookEnvelope<D>>,
    ): void {
        const priorHooks = this._hooks.get(name) || [];

        this._hooks.set(
            name,
            priorHooks.concat(hook),
        );
    }

    public unregister<D>(
        name: THookName,
        hook: NonNullable<THookEnvelope<D>>,
    ): void {
        const priorHooks = this._hooks.get(name);

        if (priorHooks === undefined) {
            return;
        }

        const filteredHooks = priorHooks.filter(
            priorHook => priorHook !== hook,
        );

        if (filteredHooks.length === 0) {
            this._hooks.delete(name);

            return;
        }

        this._hooks.set(
            name,
            filteredHooks,
        );
    }

    public unregisterAll(): void {
        this._hooks.clear();
    }

    public exec<D = THookData>(
        name: THookName,
        data?: D,
    ) {
        const hooks = this._hooks.get(name) || [];

        for (const hook of hooks) {
            hook(
                data,
            );
        }
    }
}

export const hooks = new HookRegistry();
