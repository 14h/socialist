
// Exception free local storage wrapper
class SafeLocalStorage {
    private readonly localStorageContainer?: Storage;

    constructor() {
        try {
            window.localStorage.setItem( '__', '__' );
            window.localStorage.removeItem( '__' );

            this.localStorageContainer = window.localStorage;

            return;
        } catch ( error ) {
            console.warn( 'localStorage is not available. Error:', error );
        }

        try {
            window.sessionStorage.setItem( '__', '__' );
            window.sessionStorage.removeItem( '__' );

            this.localStorageContainer = window.sessionStorage;

            console.warn( 'Defaulted to sessionStorage' );

            return;
        } catch ( error ) {
            console.warn( 'sessionStorage is not available either. Error:', error );
        }

        console.warn( 'Out of strategies. User will not be able to store configuration in local ephemeral storages.' );
    }

    protected execute = <T>(
        callback: (storage: Storage) => T,
        errorCallback: (error: Error) => T,
    ): T => {
        if ( !this.localStorageContainer ) {
            throw new Error( 'localStorage is not available.' );
        }

        try {
            return callback(this.localStorageContainer);
        } catch (error) {
            return errorCallback(error);
        }
    }

    public getItem = ( key: string ): string | null => {
        return this.execute(
            ( storage ) => storage.getItem(key),
            ( error ) => {
                console.warn( 'Writing to localStorage failed. Error:', error );
                return null;
            },
        );
    }

    public setItem = ( key: string, value: string ): void => {
        return this.execute(
            ( storage ) => storage.setItem(key, value),
            ( error ) => console.warn( 'Reading from localStorage failed. Error:', error ),
        );
    }

    public removeItem = ( key: string ): void => {
        return this.execute(
            ( storage ) => storage.removeItem(key),
            ( error ) => console.warn( 'Removing from localStorage failed. Error:', error ),
        );
    }
}

export const safeLocalStorage = new SafeLocalStorage();
