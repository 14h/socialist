type AnyClassName = { [ key: string ]: boolean; };
type ClassName = string | AnyClassName | boolean;

export const joinClassNames = ( ...args: ClassName[] ): string => {
    const classes: string[] = [];

    args.forEach( arg => {
        if ( !arg ) {
            return;
        }

        if ( typeof arg === 'string' ) {

            classes.push( arg );

        } else if ( Array.isArray( arg ) && arg.length ) {
            const inner = joinClassNames.apply( null, arg );

            if ( inner ) {
                classes.push( inner );
            }

        } else if ( typeof arg === 'object' ) {
            Object.keys( arg ).forEach( key => {
                if ( arg[ key ] ) {
                    classes.push( key );
                }
            } );
        }
    } );

    return classes.join( ' ' );
};

export const uidClipboardCopier = ( uid: string ) => {
    const el = document.createElement( 'textarea' );
    el.value = uid;
    document.body.appendChild( el );
    el.select();
    document.execCommand( 'copy' );
    document.body.removeChild( el );
}
