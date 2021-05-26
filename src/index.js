
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries      from './dictionaries.js';
import Listener          from './events.js';
import URLDataRequest    from './url-data-requests.js';
import { setTabType, removeTabType, findTabType } from './tab-types.js';
import { awaitElement, awaitUndefined } from './await.js';
import { TimeFrame } from './time-frame.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' );

console.log( 'new version' );

awaitElement( 'video' ).then( ([video]) => {

    console.log(video);

    new TimeFrame( video, 10, 15 )
        .on( 'enter', () => {
            console.log('entered');
        })
        .on( 'exit', () => {
            console.log('exited');
        })
});