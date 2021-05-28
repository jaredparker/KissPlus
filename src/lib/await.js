
// ### IMPORTS ###

import { awaitInterval } from '../config.js';

// ### MAIN ###

export function awaitElement( selector ){
    return awaitUndefined( () => {
        const $el = $(selector);
        return ($el.length) ? [ $el[0], $el ] : undefined;
    });
}

export function awaitUndefined( func ){
    return new Promise( ( resolve, reject ) => {

        const check = () => {
            const result = func();
            if( result ){
                clearInterval( interval );
                resolve( result );
            }
        }

        const interval = setInterval( check, awaitInterval );
        check();
    });
}