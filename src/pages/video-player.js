
// ### IMPORTS ###

import { types } from '../config.js';

import Dictionaries from '../lib/dictionaries.js';
import Listener from '../lib/events.js';

import { faviconURL } from '../config.js';
import { awaitElement, awaitUndefined } from '../lib/await.js';
import { SeriesData, VideoData } from '../utils/data.js';
import { setTabType, findTabType } from '../lib/tab-types.js';

import VideoPlayerComponent from '../components/video-player.js';
import URLDataRequest from '../lib/url-data-requests.js';

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

    // # MAIN #

    const [ video, $video ] = await awaitElement( 'video' );

    video.play();

    // - COMPONENT -

    // Format episode subtitle
    const episodeText =
        (videoData.episode.type) ?
            (videoData.episode.name) ?
                `${videoData.episode.type}: ${videoData.episode.name}` // Got Episode type and name! ( Shorts: The CrossEyed Ducks Car )
            :
                videoData.episode.type // Usually if just '_pilot'
        :
            videoData.episode.name // Episode type not specified

    console.log( videoData.controllerURLs );

    new VideoPlayerComponent( 'body', {

        video: 'video',

        title: seriesData.name,
        subtitle: episodeText,
        coverImage: seriesData.coverImage,

        prevEp: !!videoData.controllerURLs[ types.episode.PREVIOUS ],
        nextEp: !!videoData.controllerURLs[ types.episode.NEXT ]

    })
        // Episode Buttons
        .on( 'clickedNextEpisode', function(){
            requestEpisode( types.episode.NEXT );
            startEpisode( types.episode.NEXT );
        })
        .on( 'clickedPrevEpisode', function(){
            requestEpisode( types.episode.PREVIOUS );
            startEpisode( types.episode.PREVIOUS );
        })

        // Close Button
        .on( 'clickedClose', async function(){
            const tab = await findTabType( seriesData.id, types.tab.CONTROLLER );

            // Focus Player tab
            if( tab != null ){
                new Listener( seriesData.id )
                    .trigger( 'focusController' );
                window.close();

            // Open new Player tab
            } else {
                GM_openInTab( videoData.controllerURLs[ types.episode.CURRENT ], { active: true, setParent: true } );
                window.close();
            }
        })

        // Auto play
        .on( 'prepareNextVideo', function(){
            requestEpisode( types.episode.NEXT );
        })
        .on( 'startNextVideo', function(){
            startEpisode( types.episode.NEXT );
        });

    async function requestEpisode( type ){
        const tab = await findTabType( seriesData.id, types.tab.CONTROLLER );

        const controllerURL = videoData.controllerURLs[ type ];

        // Update Controller tab
        if( tab != null ){
            new Listener( seriesData.id )
                .trigger( 'requestEpisode', { url: controllerURL }, event => {
                    videoData.videoURLs[ type ] = event.data.videoURL
                })

        // Open new Controller tab
        } else {
            new URLDataRequest( controllerURL )
                .request( 'videoURL', data => {
                    videoData.videoURLs[ type ] = data.videoURL;
                });
            GM_openInTab( controllerURL );
        }
    }

    async function startEpisode( type ){
        window.location.href = await awaitUndefined( () => videoData.videoURLs[ type ] );
    }
}