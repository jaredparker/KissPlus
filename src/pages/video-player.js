
// ### IMPORTS ###

import { types } from '../config.js';

import Dictionaries from '../lib/dictionaries.js';
import Listener from '../lib/events.js';

import { faviconURL } from '../config.js';
import { awaitElement } from '../lib/await.js';
import { SeriesData, VideoData } from '../utils/series-data.js';
import { setTabType } from '../lib/tab-types.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'videos' );

// ### MAIN ###

export function check(){
    return !!dictionaries.videos.get( window.location.href );
}

export async function execute(){

    // # INIT #

    // - DATA -

    const videoData  = new VideoData( window.location.href ).get();
    const seriesData = new SeriesData( videoData.seriesID ).get();

    // - TABS -

    console.log(videoData);

    console.log( seriesData.id, types.tab.PLAYER )

    setTabType( seriesData.id, types.tab.PLAYER );

    // - EVENTS -

    new Listener( seriesData.id )

        .on.action( 'focusPlayer', () => window.focus() )

        .on.action( 'playNewVideo', event => {
            // Change video if not currently playing requested video
            if( window.location.href != event.data.videoURL ){
                window.location.href = event.data.videoURL;
            }
        });

    // - EXTRA -

    document.title = `${seriesData.name}: ${videoData.episode.name}`;
    $('head').append( $('<link rel="icon"/>').attr( 'href', faviconURL ) );

    //

    const [ video, $video ] = await awaitElement( 'video' );

    video.play();
}