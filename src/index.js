
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries      from './dictionaries.js';
import Listener          from './events.js';
import URLDataRequest    from './url-data-requests.js';
import { setTabType, removeTabType, findTabType } from './tab-types.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' );

GM_getTabs( console.log );

setTabType( 'testType' ).then( () => {
    GM_getTabs( console.log );

    findTabType( 'testType' ).then( tab => {
        console.log( 'testType tab:', tab );

        findTabType( 'otherType' ).then( tab => {
            console.log( 'otherType tab (should be null):', tab );

            removeTabType().then( () => {
                GM_getTabs( console.log );

                findTabType( 'testType' ).then( tab => {
                    console.log( 'testType tab (should be null):', tab );
                });
            });
        });
    });
});