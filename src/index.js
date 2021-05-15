
// ### IMPORTS ###

import { GM_getStorage } from './gm-extras.js';
import Dictionaries from './dictionaries.js';
import { Listener } from './events.js';

// ### MAIN ###

const dictionaries = new Dictionaries()
    .create( 'videos' )
    .create( 'series' )
    .create( 'requestURLs');

new Listener( 'testing' )
    .on.action( 'test1', function(){
        console.log( 'EVENT test1', arguments );
    })
    .trigger( 'test1', function(){
        console.log( 'DONE test1 a', arguments )
    })
    .trigger( 'test1', {foo: 'bar'}, function(){
        console.log( 'DONE test1 b', arguments )
    })

    .one.action( 'test2', function(){
        console.log( 'EVENT test2', arguments );
    })
    .trigger( 'test2', function(){
        console.log( 'DONE test2 a', arguments )
    })
    .trigger( 'test2', function(){
        console.log( 'DONE test2 b', arguments )
    })

    .one.request( 'data1', function(){
        console.log( 'EVENT data1', arguments );
        return { foo: 'bar' };
    })
    .trigger( 'data1', function(){
        console.log( 'DONE data1', arguments )
    })
    
    .one.request( 'data2', function( event, done ){
        console.log( 'EVENT data2', arguments );
        done({ foo: 'bar' });
    })
    .trigger( 'data2', function(){
        console.log( 'DONE data2', arguments )
    });

console.log( GM_getStorage() );
setTimeout( () => console.log( GM_getStorage() ), 1000 )