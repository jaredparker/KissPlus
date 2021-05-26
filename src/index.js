
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import * as seriesInfo   from './pages/seriesInfo.js';

// ### MAIN ###

console.log( 'Storage 0s', GM_getStorage() );
setTimeout( () => console.log( 'Storage 1s', GM_getStorage() ), 1000 );

// init
$(document).ready( function(){

    if( seriesInfo.check() ){
        console.log('# PAGE: Series Info #');
        seriesInfo.execute();
    }

});