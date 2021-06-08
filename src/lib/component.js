
// ### MAIN ###

export default class Component {
    constructor( appendTo, styles ){
        this._events = {};

        // - Load styles -

        let rawStyles = styles[0][1];
        for( let param in styles.params ){
            rawStyles = rawStyles.replaceAll( `%{${param}}`, styles.params[ param ] );
        }

        GM_addStyle( rawStyles );

        // - Create elements -

        const tree = this.render();
        this.createNodeChildren( [tree], $(appendTo) );
        this.tree = tree;
    }

    // Recursively create new elements
    createNodeChildren( children, appendTo ){

        for( let el of children ){
            const $el   = this.createNode(el)
            el._element = $el;
            
            $el.appendTo( appendTo );

            if( el.children ){
                this.createNodeChildren( el.children, $el );
            }
        }

    }

    // Create a new element
    createNode({ tag, classes, text, src, click }){

        const $el = $(`<${tag}/>`);
    
        if( classes ){
            $el.addClass( classes.join(' ') );
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

        return $el;
    }

    // ### EVENTS ###

    trigger( eventName ){
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