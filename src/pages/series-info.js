
// ### IMPORTS ###

import Dictionaries from '../lib/dictionaries.js';

import { SeriesData, getFullURL, parseSeriesURL } from '../utils/series-data.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'series' );

// ### MAIN ###

export function check(){
    return getCoverImage().length == 1;
}

export function execute(){

    const seriesID = parseSeriesURL(window.location);
    const coverSrc = getCoverImage().attr('src');

    const coverImage = getFullURL( coverSrc );

    // Save cover image url
    new SeriesData( seriesID )
        .add( {coverImage} )
        .store();
}

function getCoverImage(){
    // kisscartoon & kissanime
    const coverA = $('#rightside > :first-child img');

    // kimcartoon.li
    const coverB = $('#leftside > .bigBarContainer > .barContent > :first-child img');

    // kimcartoon.si
    const coverC = $('#leftside > .bigBarContainer:first-child .left_movie img');

    return ( coverA.length==1 ) ? coverA : ( coverB.length==1 ) ? coverB : coverC;
}