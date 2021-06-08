
// ### IMPORTS ###

import { openPlayerIconURL } from '../config.js';

import Component from '../lib/component.js';
import styles from '../styles/video-player.scss';

// ### MAIN ###

export default class VideoPlayer extends Component {

    constructor( appendTo, options ){
        super( appendTo, styles );
    }

    render(){
        return {
            // Wrapper
            tag: 'div',
            classes: [ styles.locals.wrapper ],
            children: [
                {
                    // Episode Buttons
                    tag: 'div',
                    classes: [ styles.locals.episodeButtons ],
                    children: [
                        {
                            // Previous Episode
                            tag: 'div',
                            classes: [ styles.locals.episodeButton, styles.locals.prev ],
                            text: '◄  Previous Episode',
                            click: () => this.trigger( 'clickedPrevEpisode' )
                        },
                        {
                            // Next Episode
                            tag: 'div',
                            classes: [ styles.locals.episodeButton, styles.locals.next ],
                            text: '►  Next Episode',
                            click: () => this.trigger( 'clickedNextEpisode' )
                        }
                    ]
                }
            ]

        }
    }
}