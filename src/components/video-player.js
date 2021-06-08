
// ### IMPORTS ###

import { openPlayerIconURL } from '../config.js';

import Component from '../lib/component.js';
import styles from '../styles/video-player.scss';

// ### MAIN ###

export default class VideoPlayer extends Component {

    constructor( appendTo, options ){
        super( styles );

        this.title = options.title;
        this.subtitle = options.subtitle;
        this.coverImage = options.coverImage;

        this.build( appendTo );
    }

    render(){

        // - VIDEO TITLE -

        const videoTitle = [];
        
        if( this.coverImage ){
            videoTitle.push({
                // Video Title Cover Image
                tag: 'img',
                src: this.coverImage
            })
        }
        videoTitle.push({
            // Video Title Text
            tag: 'div',
            classes: [ styles.locals.titleText ],
            children: [
                {
                    tag: 'h1',
                    text: this.title
                },
                {
                    tag: 'h2',
                    text: this.subtitle
                }
            ]
        });

        // - EPISODE BUTTONS -

        return {
            // Wrapper
            tag: 'div',
            classes: [ styles.locals.wrapper ],
            children: [
                {
                    // Video Title
                    tag: 'div',
                    classes: [ styles.locals.title ],
                    children: videoTitle
                },
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