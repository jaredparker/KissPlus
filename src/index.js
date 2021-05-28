
// ### IMPORTS ###

import { GM_getStorage } from './lib/gm-extras.js';
import * as seriesInfo   from './pages/series-info.js';
import * as episodeController from './pages/episode-controller.js';
import * as videoPlayer from './pages/video-player.js';

// ### MAIN ###

console.log( 'Storage 0s', GM_getStorage() );
setTimeout( () => console.log( 'Storage 1s', GM_getStorage() ), 1000 );

// init
$(document).ready( function(){

    if( seriesInfo.check() ){
        console.log('# PAGE: Series Info #');
        seriesInfo.execute();

    } else if( episodeController.check() ){
        console.log('# PAGE: Episode Controller #');
        episodeController.execute();

    } else if( videoPlayer.check() ){
        console.log('# PAGE: Episode Player #');
        videoPlayer.execute();
    }

});