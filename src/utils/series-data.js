
// ### IMPORTS ###

import Dictionaries from '../lib/dictionaries.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'videos' );

// ### MAIN ###

// - DATA STRUCTURES -

export class VideoData {
    constructor( videoURL ){
        this.videoURL       = videoURL;
        this.seriesID       = undefined;
        this.episode        = undefined;
        this.controllerURLs = undefined;
    }

    create(){
        this.seriesID = getSeriesID();
        this.episode  = getEpisodeData();

        return this; // Support chaining
    }

    get(){
        const data = dictionaries.videos.get( this.videoURL );

        this.seriesID = data.seriesID;
        this.episode  = data.episode;

        return this; // Support chaining
    }

    store(){
        dictionaries.videos.update( this.videoURL, {
            seriesID: this.seriesID,
            episode: this.episode
        });

        return this; // Support chaining
    }
}

// - GET -

export function getSeriesID(){

    // ~ Get link from element instead of window.location because some sites (kimcartoon)
    //   proxy the pathname to something random
    const seriesTextA = $('#navsubbar > p > a'); // - top of page under main nav
    const seriesTextB = $('.watch_container .a_center a:has(strong)'); // - under comments
    const seriesHref  = (( seriesTextA.length == 1 ) ? seriesTextA : seriesTextB ).attr('href');

    const url  = new URL(seriesHref);
    const path = url.pathname.split('/');
    const id   = path[2].split('.')[0];
    
    return id;
}

export function getEpisodeData(){

    const episodeSelected = $('#selectEpisode option:selected');
    const path = episodeSelected.val().split('/');

    const id   = path[ path.length-1 ].split('?')[0];
    const name = episodeSelected.text().trim();

    return { id, ...parseEpisodeName(name) };
}

// - FORMAT -

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