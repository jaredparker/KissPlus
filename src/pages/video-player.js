
// ### IMPORTS ###

import { awaitElement } from '../lib/await.js';
import Dictionaries from '../lib/dictionaries.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'videos' );

// ### MAIN ###

export function check(){
    return !!dictionaries.videos.get( window.location.href );
}

export async function execute(){

    const [ video, $video ] = await awaitElement( 'video' );

    video.play();
}