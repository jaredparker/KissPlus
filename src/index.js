
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
