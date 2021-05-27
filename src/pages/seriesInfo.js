
// ### IMPORTS ###

import Dictionaries from '../dictionaries.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'series' );

// ### MAIN ###

function getCoverImage(){
    // kisscartoon & kissanime
    const coverA = $('#rightside > :first-child img');

    // kimcartoon
    const coverB = $('#leftside > .bigBarContainer > .barContent > :first-child img');

    return ( coverA.length ) ? coverA : coverB;
}

export function check(){
    return getCoverImage().length == 1;
}

export function execute(){

    const seriesID = window.location.pathname.split('/')[2].split('.')[0];
    const coverSrc = getCoverImage().attr('src');

    // Src already includes an origin
    try {
        var coverHref = new URL(coverSrc).href;

    // Src doesn't include site's origin
    } catch {
        var coverHref = `${window.origin}${coverSrc}`;
    }

    // Save cover image url
    dictionaries.series.update( seriesID, {
        coverImage: coverHref
    });
}   