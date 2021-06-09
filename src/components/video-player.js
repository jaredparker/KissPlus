
// ### IMPORTS ###

import { autoHideWait } from '../config.js';

import TimeFrame from '../lib/time-frame.js';
import { awaitUndefined } from '../lib/await.js';

import Component from '../lib/component.js';
import styles from '../styles/video-player.scss';

// ### MAIN ###

export default class VideoPlayer extends Component {

    constructor( appendTo, options={} ){
        super( styles );

        this.options = options;

        this.build( appendTo );

        this.setup();
    }

    async setup(){

        // - AUTO HIDE -

        const $video = $( this.options.video );
        const video  = $video[0];

        let hideTimeout;
        
        const resetTimeout = () => {
            clearTimeout( hideTimeout );
            hideTimeout = setTimeout( () => this.hide(), autoHideWait );
        }

        const onMouseMove = () => {
            $video.on( 'mousemove', () => {
                this.show();
                resetTimeout();
            });
        }

        $video.on( 'play', () => {
            resetTimeout();
            onMouseMove();
        });

        $video.on( 'pause', () => {
            clearTimeout( hideTimeout );
            $video.off( 'mousemove' );
            this.show();
        });
    }

    hide(){
        console.log('hide');
        this.tree._element.addClass( styles.locals.hide );
        this.tree._element.removeClass( styles.locals.show );
    }

    show(){
        console.log('show');
        this.tree._element.addClass( styles.locals.show );
        this.tree._element.removeClass( styles.locals.hide );
    }

    render(){

        // - VIDEO TITLE -

        const videoTitle = [];
        
        if( this.options.coverImage ){
            videoTitle.push({
                // Video Title Cover Image
                tag: 'img',
                src: this.options.coverImage
            })
        }
        videoTitle.push({
            // Video Title Text
            tag: 'div',
            classes: [ styles.locals.titleText ],
            children: [
                {
                    tag: 'h1',
                    text: this.options.title
                },
                {
                    tag: 'h2',
                    text: this.options.subtitle
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
                            click: () => this.trigger( 'clickedPrevEpisode' ),
                            children: [
                                {
                                    tag: 'button',
                                    text: '◄  Previous Episode'
                                }
                            ]
                        },
                        {
                            // Next Episode
                            tag: 'div',
                            classes: [ styles.locals.episodeButton, styles.locals.next ],
                            click: () => this.trigger( 'clickedNextEpisode' ),
                            children: [
                                {
                                    tag: 'button',
                                    text: '►  Next Episode'
                                }
                            ]
                        }
                    ]
                }
            ]

        }
    }
}