
// ### IMPORTS ###

import { types } from '../config.js';

import Dictionaries from '../lib/dictionaries.js';
import Listener from '../lib/events.js';

import { awaitElement } from '../lib/await.js';
import { getSeriesID, SeriesData, VideoData } from '../utils/series-data.js';
import { findTabType, setTabType } from '../lib/tab-types.js';

import OpenVideoComponent from '../components/open-video.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'series' );

// ### MAIN ###

export function check(){
    // kisscartoon & kissanime
    const playerA = $('#movie-player #player_container');

    // kimcartoon (Non-beta servers)
    const playerB = $('iframe#my_video_1');

    return !!playerA.length || !!playerB.length;
}

export async function execute(){

    // # INIT #

    // - DATA -
    
    // kimcartoon
    let player = $('#my_video_1');

    // kisscartoon & kissanime
    if( !player.length ){
        [, player] = await awaitElement('#movie-player #player_container iframe');
    }

    const videoURL = player.attr('src');
    const seriesID = getSeriesID();

    const videoData  = new VideoData( videoURL ).create().store();
    const seriesData = new SeriesData( seriesID ).get().create().store();

    // - TABS -

    setTabType( seriesData.id, types.tab.CONTROLLER );

    // - EVENTS -

    // # MAIN #

    async function openPlayer(){
        const tab = await findTabType( seriesData.id, types.tab.PLAYER );

        // Update Player tab
        if( tab ){
            new Listener( seriesData.id )
                .trigger( 'focusPlayer' )
                .trigger( 'playNewVideo', { videoURL } );

        // Open new Player tab
        } else {
            GM_openInTab( videoURL, { active: true, setParent: true } );
        }
    }

    new OpenVideoComponent( '#divContentVideo', {
        hide: '#my_video_1',
        coverImage: seriesData.coverImage
    })
        .on( 'clickedOpenVideo', openPlayer )
        .on( 'clickedClose', function(){
            this.hide();
        });
}