
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries      from './dictionaries.js';
import Listener          from './events.js';
import URLDataRequest    from './url-data-requests.js';
import { setTabType, removeTabType, findTabType } from './tab-types.js';
import { awaitUndefined } from './await.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' );

console.log('Load');

let variable = undefined;

awaitUndefined( () => variable ).then( function(){
    console.log( 'variable set: ', ...arguments );
});

setTimeout( () => {
    variable = 'Hello World!';
}, 2000 );