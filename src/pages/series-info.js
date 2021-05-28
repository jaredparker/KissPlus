
// ### IMPORTS ###

import Dictionaries from '../lib/dictionaries.js';
import { parseSeriesURL, SeriesData } from '../utils/series-data.js';

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

    // Src already includes an origin
    try {
        var coverHref = new URL(coverSrc).href;

    // Src doesn't include site's origin
    } catch {
        var coverHref = `${window.origin}${coverSrc}`;
    }

    // Save cover image url
    new SeriesData( seriesID )
        .add({
            coverImage: coverHref
        })
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