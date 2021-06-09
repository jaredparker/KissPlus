
// ### MAIN ###

export default class Component {
    constructor( styles ){
        this._events = {};
        this._refs   = {};

        // - Load styles -

        let rawStyles = styles[0][1];
        for( let param in styles.params ){
            rawStyles = rawStyles.replaceAll( `%{${param}}`, styles.params[ param ] );
        }

        GM_addStyle( rawStyles );
    }

    build( appendTo ){
        this.tree = this.render();
        this.createNodeChildren( [this.tree], $(appendTo) );
    }

    // Recursively create new elements
    createNodeChildren( children, appendTo ){

        for( let el of children ){
            const $el   = this.createNode(el);
            
            $el.appendTo( appendTo );

            if( el.children ){
                this.createNodeChildren( el.children, $el );
            }
        }

    }

    // Create a new element
    createNode( element ){
        const { tag, classes, ref, events, text, src, click } = element;

        const $el = $(`<${tag}/>`);
        element._element = $el;
    
        if( classes ){
            $el.addClass( classes.join(' ') );
        }
        if( ref ){
            this._refs[ ref ] = $el;
        }
        if( text ){
            $el.text( text );
        }
        if( src ){
            $el.attr( 'src', src );
        }
        if( click ){
            $el.click( click );
        }
        if( events ){
            for( let event of Object.keys( events ) ){
                $el.on( event, events[ event ] );
            }
        }

        return $el;
    }

    get( ref ){
        return this._refs[ ref ];
    }

    // ### EVENTS ###

    trigger( eventName ){
        if( !this._events[ eventName ] ) return this;

        for( let event of this._events[ eventName ] ){
            event.call( this );
        }

        return this; // Support chaining
    }
    on( eventName, handler ){
        if( !this._events[ eventName ] ){
            this._events[ eventName ] = [];
        }

        // Add event
        this._events[ eventName ].push( handler );

        return this; // Support chaining
    }
}