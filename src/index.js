
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries      from './dictionaries.js';
import Listener          from './events.js';
import URLDataRequest    from './url-data-requests.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' );

console.log( GM_getStorage() );

new URLDataRequest( window.location.href ).request( 'videoURL', function( data ){
    console.log( 'got data!', data );
});

console.log( GM_getStorage() );

new URLDataRequest( window.location.href ).response( 'videoURL', {cool: 'data'} );

console.log( GM_getStorage() );