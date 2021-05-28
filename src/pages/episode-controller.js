
// ### IMPORTS ###

import Dictionaries from '../lib/dictionaries.js';
import { awaitElement } from '../lib/await.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'series' );

// ### MAIN ###

export function check(){
    // kisscartoon & kissanime
    const playerA = $('#movie-player #player_container');

    // kimcartoon
    const playerB = $('#my_video_1');

    return !!playerA.length || !!playerB.length;
}

export async function execute(){
    
    // kimcartoon
    let player = $('#my_video_1');

    // kisscartoon & kissanime
    if( !player.length ){
        [, player] = await awaitElement('#movie-player #player_container iframe');
    }

    const videoURL = player.attr('src');

    console.log(videoURL);
}