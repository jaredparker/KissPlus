
// ### IMPORTS ###

import {
    GM_getObjValue,
    GM_updateObjValue
} from './gm-extras.js';

import {
    storageVariables
} from './config.js';

import Dictionaries from './dictionaries.js';
import Listener from './events.js';

// ### INIT ###

const dictionaries = new Dictionaries()
    .create( 'requestURLs');

// ### MAIN ###

// @ Used for continued communication with new tabs
// ~ Uses events to transmit data
export default class URLDataRequest {

    constructor( url ){
        this.url = url;
    }

    // ~ Takes responseMethod as function or event.info
    request( requestName, responseMethod ){
        
        const requestInfo = {}

        // Emulate event
        if( typeof responseMethod == 'function'){
            const eventName = `${this.url}-${requestName}`;

            new Listener('URL-REQUESTS')
                .one.request( eventName, event => {
                    requestInfo.event = event.info
                })
                .trigger( eventName, event => {
                    // Got request response
                    responseMethod( event.data );
                });

        // Add event data (responses via event data)
        } else {
            requestInfo.event = responseMethod;
        }

        dictionaries.requestURLs.update( this.url, {
            [requestName]: requestInfo
        });
    }

    response( requestName, data ){
        if( !this.check( requestName ) ){ return; }

        const requests = this.#getRequests();
        const request  = requests[ requestName ];

        // Remove from storage
        delete requests[ requestName ];
        
        if( Object.keys( requests ).length <= 0 ){
            dictionaries.requestURLs.remove( this.url );
        } else {
            dictionaries.requestURLs.set( this.url, requests );
        }

        // Send back data
        new Listener( request.event.catergory )
            .done( request.event.name, request.event.id, data );
    }

    // @ Checks if there is an open request
    check( requestName ){
        return ( this.#getRequest( requestName ) ) ? true : false;
    }

    #getRequest( requestName ){
        return this.#getRequests()[ requestName ] || undefined;
    }
    
    #getRequests(){
        return dictionaries.requestURLs.get( this.url ) || {};
    }
}