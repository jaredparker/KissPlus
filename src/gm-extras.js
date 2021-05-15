
export function GM_getStorage(){
    const keys = GM_listValues();
    const storage = {};

    for( let key of keys ){
        let value = GM_getValue(key);

        // Obj Value
        try {
            storage[key] = JSON.parse(value);

        // Normal Value
        } catch {
            storage[key] = value;
        }
    }
    return storage;
}

export function GM_setObjValue( name, newObj ){
    GM_setValue( name, JSON.stringify( newObj ) );
}

export function GM_updateObjValue( name, newObj, deep=true ){

    const obj = GM_getObjValue( name ) || {};
    const updatedObj = $.extend( deep, obj, newObj ); // Update
    GM_setObjValue( name, updatedObj );
}

export function GM_getObjValue( name, newObj ){
    const value = GM_getValue( name );

    try {
        return JSON.parse( value );

    } catch {
        return undefined;
    };
}

export function GM_removeObjValue( name, key ){
    const obj = GM_getObjValue( name );
    if( obj ){ delete obj[key]; }
}

export function GM_findTab( filter, cb ){

    GM_getTabs( tabs => {

        // Search for tab
        for( let i in tabs ){
            const tab = tabs[i];

            if( filter(tab) ){
                // Tab found
                return cb(tab);
            }
        }

        // Tab not found
        return cb(null);
    });
}