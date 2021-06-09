
// ### IMPORTS ###

import { types } from '../config.js';

import Dictionaries from '../lib/dictionaries.js';
import Listener from '../lib/events.js';

import { awaitElement } from '../lib/await.js';
import { SeriesData, VideoData, getSeriesID, getCurrentURL } from '../utils/data.js';
import { findTabType, setTabType } from '../lib/tab-types.js';

import OpenVideoComponent from '../components/open-video.js';
import URLDataRequest from '../lib/url-data-requests.js';

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

    const videoURL = new URL(player.attr('src')).href;
    const seriesID = getSeriesID();

    const videoData  = new VideoData( videoURL ).create().store();
    const seriesData = new SeriesData( seriesID ).get().create().store(); // ~ .get() for coverImage

    // - TABS -

    setTabType( seriesData.id, types.tab.CONTROLLER );

    // - EVENTS -

    new Listener( seriesData.id )

        .on.action( 'focusController', () => window.focus )
        
        .on.request( 'requestEpisode', function( event, done ){

            // Already on requested page
            if( event.data.url == window.location.href ){
                done( {videoURL} );

            // Request data from different page
            } else {
                new URLDataRequest( event.data.url )
                    .request( 'videoURL', event.info );
                window.location.href = event.data.url;
            }
        });

        
    new URLDataRequest( getCurrentURL() )
        .respond( 'videoURL', {videoURL} );

    // # MAIN #

    async function openPlayer(){
        const tab = await findTabType( seriesData.id, types.tab.PLAYER );

        // Update Player tab
        if( tab != null ){
            new Listener( seriesData.id )
                .trigger( 'focusPlayer' )
                .trigger( 'playNewVideo', { videoURL } );

        // Open new Player tab
        } else {
            GM_openInTab( videoURL, { active: true, setParent: true } );
        }
    }

    const contentVideo = $('#divContentVideo');
    const container    = ( contentVideo.length ) ? '#divContentVideo' : '#player_container';

    new OpenVideoComponent( container, {
        hide: player,
        coverImage: seriesData.coverImage
    })
        .on( 'clickedOpenVideo', openPlayer )
        
        .on( 'clickedClose', function(){
            this.hide();
        });
}