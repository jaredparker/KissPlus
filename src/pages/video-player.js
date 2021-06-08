
// ### IMPORTS ###

import { types } from '../config.js';

import Dictionaries from '../lib/dictionaries.js';
import Listener from '../lib/events.js';

import { faviconURL } from '../config.js';
import { awaitElement, awaitUndefined } from '../lib/await.js';
import { SeriesData, VideoData } from '../utils/series-data.js';
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

    new VideoPlayerComponent( 'body', {

        title: seriesData.name,
        subtitle: episodeText,
        coverImage: seriesData.coverImage

    })
        .on( 'clickedNextEpisode', function(){
            requestEpisode( types.episode.NEXT );
            startEpisode( types.episode.NEXT );
        })

        .on( 'clickedPrevEpisode', function(){
            requestEpisode( types.episode.PREVIOUS );
            startEpisode( types.episode.PREVIOUS );
        });

    async function requestEpisode( type ){
        const tab = await findTabType( seriesData.id, types.tab.CONTROLLER );

        const controllerURL = videoData.controllerURLs[ type ];

        // Update Controller tab
        if( tab != null ){
            new Listener( seriesData.id )
                .trigger( 'requestEpisode', { url: controllerURL }, event => {
                    console.log(event)
                    videoData.videoURLs[ type ] = event.data.videoURL
                })

        // Open new Controller tab
        } else {
            new URLDataRequest( controllerURL )
                .request( 'videoURL', data => {
                    console.log(data)
                    videoData.videoURLs[ type ] = data.videoURL;
                });
            GM_openInTab( controllerURL );
        }
    }

    async function startEpisode( type ){
        window.location.href = await awaitUndefined( () => videoData.videoURLs[ type ] );
    }
}