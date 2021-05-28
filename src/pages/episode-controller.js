
// ### IMPORTS ###

import Dictionaries from '../lib/dictionaries.js';
import { awaitElement } from '../lib/await.js';
import { getSeriesID, SeriesData, VideoData } from '../utils/series-data.js';
import { findTabType, setTabType } from '../lib/tab-types.js';
import { types } from '../config.js';

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

    setTabType( seriesID, types.tab.CONTROLLER );

    // - EVENTS -

    // # MAIN #

    async function openPlayer(){
        const tab = await findTabType( seriesID, types.tab.PLAYER );
        if( tab ){

        } else {
            GM_openInTab( videoURL, { active: true, setParent: true } );
        }
    }

    openPlayer();
}