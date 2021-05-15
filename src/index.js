
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries from './dictionaries.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' )
    .create( 'requestURLs');

console.log( GM_getStorage() );

dictionaries.videos.set( 'goo', {foo: 'far'} );
dictionaries.videos.set( 'moo', {foo: 'far'} );
dictionaries.videos.update( 'moo', {'a': 'b'} );

console.log( GM_getStorage() );