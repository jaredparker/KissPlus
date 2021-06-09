
// ### IMPORTS ###

import { timeoutLeeway } from '../config';

// ### MAIN ###
// ? Used to show elements at different time stamps

export default class TimeFrame {

    constructor( video, startTime, endTime ){

        this.video  = video;
        this.startTime = startTime;
        this.endTime   = endTime;

        this.events = {
            'enter': [],
            'exit': []
        };

        // ? Used when user seeks
        this.lastState = -1; // -1/0/1 = before/active/after

        const $video = $(video);

        $video.on( 'play',   () => this.#played() );
        $video.on( 'pause',  () => this.#paused() );
        $video.on( 'seeked', () => this.#seeked() );

        this.#setNextEventTimeout();
    }

    // # STATE INFO #

    before (){ return this.video.currentTime + timeoutLeeway < this.startTime; }
    after  (){ return this.video.currentTime + timeoutLeeway > this.endTime;   }
    active (){ return !( this.before() || this.after() ); } // Current time within time frame

    // # EVENTS #

    on( event, handler ){
        if( this.events[ event ] ){
            this.events[ event ].push( handler );
        }
        return this; // Supports Chaining
    }

    // - INTERNAL -

    #enter(){
        this.lastState = 0;
        this.#trigger( 'enter' );
        this.#setNextEventTimeout(); // For exit event
    }

    #exit(){
        this.lastState = (this.before()) ? -1 : 1;
        this.#trigger( 'exit' );
    }

    #trigger( event ){
        for( let cb of this.events[event] ){ cb(); }
    }

    // - EXTERNAL -

    #played(){
        this.#setNextEventTimeout();
    }
    
    #paused(){
        clearTimeout( this._timer );
    }

    #seeked(){
        const active = this.active();

        // Current time changed to inside time frame
        if( active && this.lastState != 0 ){
            this.#enter();

        // Current time changed to outside time frame
        } else if( this.lastState == 0 && !active ){
            this.#exit();
        }
    }

    // # PREDICTION OF EVENTS #

    // Start next timer to next event point based on current time stamp
    #setNextEventTimeout(){
        if( this.video.paused ) return;

        // onEnter ( timer from '0s' -> 'startTime' )
        if( this.before() ){
            this.#setEstimatedTimeout( this.startTime, () => this.#enter() );

        // onExit ( timer from 'startTime' -> 'endTime' )
        } else if( !this.after() ){
            this.#setEstimatedTimeout( this.endTime, () => this.#exit() );
        }
            
    }

    // Set timeout to when seek point (seconds) reached in video
    #setEstimatedTimeout( seconds, cb ){

        const estimatedWait = seconds - this.video.currentTime;

        this._timer = setTimeout( () => {

            // ~ a little leeway given because of estimation
            if( this.video.currentTime + timeoutLeeway >= seconds ){
                cb();

            } else {
                this.#setNextEventTimeout();
            }

        }, estimatedWait * 1000 ); // Convert seconds to milliseconds
    }
}