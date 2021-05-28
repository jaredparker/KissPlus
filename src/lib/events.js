
// ### IMPORTS ###

import { GM_getObjValue, GM_setObjValue } from './gm-extras.js';
import { storageVariables, types } from '../config.js';

// ### MAIN ###
// ? Used for communication across tabs

export default class Listener {

    constructor( catergory ){
        this.catergory = catergory;
    }

    // ### PRIVATE ###

    // Auto run 'done' function
    #onAction( eventName, handler ){
        const eventListener = new EventListener( this.catergory, eventName, {type: types.event.TRIGGER}, async event => {
            await handler( event );
            this.done( eventName, event.info.id );
        });
        return eventListener;
    }

    // Pass 'done' function
    #onRequest( eventName, handler ){
        const eventListener = new EventListener( this.catergory, eventName, {type: types.event.TRIGGER}, async event => {

            let finished = false;
            const done = data => {
                if( !finished ){
                    finished = true;
                    this.done( eventName, event.info.id, data );
                }
            }

            const data = await handler( event, done );
            if( data ){ done( data ); }
        });
        return eventListener;
    }

    // ### PUBLIC ###

    // # On Event Trigger #
    on = {
        // Auto run 'done' function (doesn't return data)
        action: ( eventName, handler ) => {
            this.#onAction( eventName, handler );
            return this; // Support Chaining
        },

        // Pass 'done' function
        request: ( eventName, handler ) => {
            this.#onRequest( eventName, handler );
            return this; // Support Chaining
        }
    }

    // # On Event Trigger (only run once) #
    one = {
        // Auto run 'done' function (doesn't return data)
        action: ( eventName, handler ) => {
            const eventListener = this.#onAction( eventName, function(){
                eventListener.off();
                handler( ...arguments );
            });
            return this; // Support Chaining
        },

        // Pass 'done' function
        request: ( eventName, handler ) => {
            const eventListener = this.#onRequest( eventName, function(){
                eventListener.off();
                return handler( ...arguments );
            });
            return this; // Support Chaining
        },
    }

    // # Callback data to trigger source #
    done( eventName, id, data ){
        const varName = storageVariables.event( this.catergory, eventName );

        // Trigger Callback
        const event = { id, type: types.event.CALLBACK }
        if( data ){ event.data = data; }
        GM_setObjValue( varName, event );
    }

    // # Trigger event #
    trigger( eventName ){
        const varName = storageVariables.event( this.catergory, eventName );
        const id      = Date.now();

        // Overloading (eventName, cb) or (eventName, data, cb)
        let cb, data;
        if( typeof arguments[1] == 'function' ){
            cb = arguments[1];
        } else {
            data = arguments[1];
            cb = arguments[2];
        }

        // On Callback
        const eventListener = new EventListener( this.catergory, eventName, {type: types.event.CALLBACK, id}, event => {
            eventListener.off();

            // Clean up
            eventListener.clear();
            // Timeout for if multiple callbacks
            setTimeout( () => {
                // Only clear if no new event calls
                if( GM_getObjValue( eventListener.varName )?.id == id ){
                    eventListener.clear();
                }
            }, 200 );

            cb( event );
        });

        // Trigger
        const event = { id, type: types.event.TRIGGER }
        if( data ){ event.data = data; }
        GM_setObjValue( varName, event );

        return this;
    }

}

// ~ Event listener wrapper to the GM_addValueChangeListener
class EventListener {

    constructor( catergory, eventName, filter, handler ){
        this.varName = storageVariables.event( catergory, eventName );

        // GM Variable Value Listener
        this.id = GM_addValueChangeListener( this.varName, ( name, oldVal, newVal ) => {
            const event = JSON.parse( newVal );

            // Return if event doesn't match filter
            for( let key of Object.keys( filter ) ){
                if( event[ key ] != filter[ key ] ){
                    return; // No need to check other keys
                }
            }

            // Matches filter
            const _event = {
                info: {
                    catergory,
                    id: event.id,
                    name: eventName,
                    type: event.type
                },
                data: event.data
            }
            handler( _event );
        });

    }

    // Stop listening to changes
    off(){
        GM_removeValueChangeListener( this.id )
    }

    // Remove recent event from storage
    clear(){
        GM_deleteValue( this.varName );
    }
}