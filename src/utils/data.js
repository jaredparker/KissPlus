
// ### IMPORTS ###

import { types } from '../config.js';
import Dictionaries from '../lib/dictionaries.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'series' )
    .create( 'videos' );

// ### MAIN ###

// - DATA STRUCTURES -

export class SeriesData {
    constructor( id ){
        this.id = id;
    }

    create(){
        this.id   = getSeriesID();
        this.name = getSeriesName();

        return this; // Support chaining
    }

    add( data ){
        Object.keys( data ).map( key =>
            this[key] = data[key]
        );

        return this; // Support chaining
    }

    get(){
        this.add( dictionaries.series.get( this.id ) || {} );

        return this; // Support chaining
    }
    
    store(){
        const data = {};
        Object.keys( this ).map( key =>
            data[key] = this[key]
        );

        dictionaries.series.update( this.id, data );

        return this; // Support chaining
    }
}

export class VideoData {
    constructor( videoURL ){
        this.videoURL       = videoURL;
        this.seriesID       = undefined;
        this.episode        = undefined;
        this.controllerURLs = {};
        this.videoURLs      = {};
    }

    create(){
        this.seriesID       = getSeriesID();
        this.episode        = getEpisodeData();
        this.controllerURLs = getControllerURLs();

        return this; // Support chaining
    }

    get(){
        const data = dictionaries.videos.get( this.videoURL );

        this.seriesID       = data.seriesID;
        this.episode        = data.episode;
        this.controllerURLs = data.controllerURLs;

        return this; // Support chaining
    }

    store(){
        dictionaries.videos.update( this.videoURL, {
            seriesID:       this.seriesID,
            episode:        this.episode,
            controllerURLs: this.controllerURLs
        });

        return this; // Support chaining
    }
}

// - GET -

export function getSeriesID(){

    const url  = getSeriesURL();
    const id   = parseSeriesURL( url );
    
    return id;
}

export function getSeriesURL(){
    // ~ Get link from element instead of window.location because some sites (kimcartoon.li)
    //   proxy the pathname to something random
    const seriesTextA = $('#navsubbar > p > a'); // - top of page under main nav
    const seriesTextB = $('.watch_container .a_center a:has(strong)'); // - under comments
    const seriesHref  = (( seriesTextA.length == 1 ) ? seriesTextA : seriesTextB ).attr('href');

    return new URL(seriesHref);
}

export function getSeriesName(){

    // kisscartoon & kissanime
    const seriesTextA = $('#navsubbar > p > a strong');
    if( seriesTextA.length ){
        return seriesTextA.text();
    }

    // kimcartoon.si
    const seriesTextB = $('.watch_title');
    if( seriesTextB.length ){
        return seriesTextB.text().replace(/(^Watch | online free$)/g, '');
    }

    // kimcartoon.li
    const seriesTextC = $('#navsubbar > p > a');
    if( seriesTextC.length ){
        return seriesTextC.text().split('\n')[2].trim();
    }
}

export function getEpisodeData(){

    const episodeSelected = $('#selectEpisode option:selected');
    const path = episodeSelected.val().split('/');

    const id   = path[ path.length-1 ].split('?')[0];
    const name = episodeSelected.text().trim();

    return { id, ...parseEpisodeName(name) };
}

export function getControllerURLs(){

    return {
        [types.episode.PREVIOUS]: getPrevEpisodeURL(),
        [types.episode.CURRENT]:  getCurrentEpisodeURL(),
        [types.episode.NEXT]:     getNextEpisodeURL()
    }
}

export function getCurrentURL(){
    const episode = getCurrentEpisodeURL();

    return episode;
}

export function getPrevEpisodeURL(){
    // Kimcartoon.li
    const buttonA = $('#Img1').closest('a').attr('href');
    // Kimcartoon.si, kisscartoon, kissanime
    const buttonB = $('#btnPrevious').closest('a').attr('href');
    
    return getEpisodeURL( [buttonA, buttonB], getSeriesURL().origin );
}
export function getCurrentEpisodeURL(){
    
    const currentHref = $('#selectEpisode [selected]').val();

    return getEpisodeURL( [currentHref], `${getSeriesURL().href}/` );
}
export function getNextEpisodeURL(){
    // Kimcartoon.li
    const buttonA = $('#Img2').closest('a').attr('href');
    // Kimcartoon.si, kisscartoon, kissanime
    const buttonB = $('#btnNext').closest('a').attr('href');

    return getEpisodeURL( [buttonA, buttonB], getSeriesURL().origin );
}

export function getEpisodeURL( hrefs, origin ){
    for( let href of hrefs ){
        if( href ){
            const fullURL = getFullURL( href, origin );
            const server  = new URL(window.location).searchParams.get('s');

            return ( server ) ? `${fullURL}&s=${server}` : fullURL;
        }
    }

}

export function getFullURL( url, origin=window.origin ){

    // url already includes an origin
    try {
        return new URL(url).href;

    // url doesn't include site's origin
    } catch {
        return `${origin}${url}`;
    }
}

// - FORMAT -

export function parseSeriesURL( url ){
    const path = url.pathname.split('/');
    const id   = path[2].split('.')[0];

    return id;
}

export function parseEpisodeName( name ){

    // Episode has type (formatted like '_TYPE - EPISODE' ) (type = Specials, Shorts, ...)
    if( name[0] == '_' ){
        const parsed = name.substring(1).split(' - ');

        return {
            type: parsed[0],
            name: parsed[1]
        };

    // Normal Episode
    } else {
        return { name };
    }

}