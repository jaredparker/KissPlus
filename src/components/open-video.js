
// ### IMPORTS ###

import { openPlayerIconURL } from '../config.js';

import Component from '../lib/component.js';
import styles from '../styles/open-video.scss';

// ### MAIN ###

export default class OpenVideo extends Component {
    constructor( appendTo, options ){
        styles.params = {
            'COVER_IMAGE': options.coverImage
        }
        super( appendTo, styles );

        this.$hide = $(options.hide);
        this.show();
    }

    show(){
        $(this.$hide).css( 'display', 'none' );
        this.tree._element.css( 'display', '' );
    }

    hide(){
        this.tree._element.css( 'display', 'none' );
        $(this.$hide).css( 'display', '' );
    }

    render(){
        return {
            // Wrapper
            tag: 'div',
            classes: [ styles.locals.wrapper ],
            children: [
                {
                    // Content
                    tag: 'div',
                    classes: [ styles.locals.content ],
                    click: () => this.trigger('clickedOpenVideo'),
                    children: [
                        {
                            // Icon
                            tag: 'h1',
                            classes: [ styles.locals.icon ],
                            children: [
                                {
                                    tag: 'img',
                                    src: openPlayerIconURL
                                }
                            ]
                        },
                        {
                            // Text
                            tag: 'h1',
                            classes: [ styles.locals.text ],
                            text: 'Open Video Player'
                        }
                    ]
                },
                {
                    // Close
                    tag: 'div',
                    classes: [ styles.locals.close ],
                    click: () => this.trigger('clickedClose'),
                }
            ]
        };
    }
}