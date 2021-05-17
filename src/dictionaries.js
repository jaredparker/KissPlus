
// ### IMPORTS ###

import { GM_getObjValue, GM_updateObjValue } from './gm-extras.js';
import { storageVariables } from './config.js';

// ### MAIN ###

export default class Dictionaries {

    create( name ){

        // Cannot overwrite existing method
        if( !this[ name ] ){
            this[ name ] = new Dictionary( name );
        }

        return this;
    }
}

class Dictionary {

    constructor( name ){
        this.varName = storageVariables.dict( name );
    }

    // @ Get item(s) in dictionary
    get( id ){
        const dict = GM_getObjValue( this.varName );

        // Return single item
        if( arguments.length ){
            return (dict) ? dict[id] : undefined;

        // Return everything in dictionary
        } else {
            return dict;
        }
    }

    // @ Set(replace) item in dictionary
    set( id, data ){
        GM_updateObjValue( this.varName, {[id]: data}, false );
    }

    // @ Update item in dictionary
    update( id, data ){
        GM_updateObjValue( this.varName, {[id]: data}, true );
    }

    // @ Remove item in dictionary
    remove( id ){
        const dict = this.get();
        delete dict[ id ];

        // Delete whole dictionary in storage if empty
        if( Object.keys( dict ).length <= 0 ){
            GM_deleteValue( this.varName );

        // Remove item in dictionary
        } else {
            GM_setObjValue( this.varName, dict, false );
        }
    }
}