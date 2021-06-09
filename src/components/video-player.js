
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

        let hoveredVideo = $video.is(':hover');
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

        function start(){
            resetTimeout();
            onMouseMove();
        }

        function stop(){
            clearTimeout( hideTimeout );
            $video.off( 'mousemove' );
        }

        $video.on( 'play', () => {
            if( hoveredVideo ){
                start();
            }
        });

        $video.on( 'pause', () => {
            stop();
            this.show();
        });

        $video.on( 'mouseenter', () => {
            hoveredVideo = true;
            start();
        });
        $video.on( 'mouseleave', () => {
            hoveredVideo = false;
            stop();
        });

        // - AUTO PLAY -

        if( this.options.nextEp ){

            const duration = await awaitUndefined( () => video.duration );

            new TimeFrame( video, duration - 20, duration + 1 )
                .on( 'enter', () => {

                    const wrapper = this.get( 'nextBtnWrap' );
                    const button  = this.get( 'nextBtn' );

                    wrapper.addClass( styles.locals.show );

                    if( !video.paused ){

                        // EVENT - Prefetch next video
                        this.trigger( 'prepareNextVideo' );

                        // Timeout till to start next episode (time to cancel)
                        const waitTime = Math.max( duration - video.currentTime, 5 );

                        button.css( 'animation', `${ styles.locals.slide } ${ waitTime }s linear forwards` );
                        let nextEpisodeTimeout = setTimeout( ()=>{

                            // Show next episode loading
                            wrapper.trigger('activate:spinner');
        
                            // EVENT - Start next video
                            this.trigger( 'startNextVideo' );
        
                        }, waitTime * 1000 );

                        // Auto next episode cancel ( pauses video, or seeks )
                        $video.one('pause', function(){
                            if( video.currentTime + 0.1 < duration ){
                                clearTimeout( nextEpisodeTimeout );
                                button.css( 'animation', '' );
                            }
                        });
                    }
                })
                .on( 'exit', () => {
                    this.get( 'nextBtnWrap' ).removeClass( styles.locals.show );
                });
        }
    }

    hide(){
        this.tree._element.addClass( styles.locals.hide );
        this.tree._element.removeClass( styles.locals.show );
    }

    show(){
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

        const episodeButtons = [];

        if( this.options.prevEp ){
            episodeButtons.push({
                // Previous Episode
                tag: 'div',
                ref: 'prevBtnWrap',
                classes: [ styles.locals.episodeButton, styles.locals.prev ],
                events: {
                    'click': () => {
                        this.get('prevBtnWrap').trigger('activate:spinner');
                        this.trigger('clickedPrevEpisode');
                    },
                    'activate:spinner': () => {
                        this.get('prevBtnWrap').addClass( styles.locals.show );
                        this.get('prevBtn')
                            .text('Previous Episode')
                            .append(
                                $('<div/>').addClass( styles.locals.spinner )
                            );
                    }
                },
                children: [
                    {
                        tag: 'button',
                        ref: 'prevBtn',
                        text: '◄  Previous Episode'
                    }
                ]
            });
        }
        if( this.options.nextEp ){
            episodeButtons.push({
                // Next Episode
                tag: 'div',
                ref: 'nextBtnWrap',
                classes: [ styles.locals.episodeButton, styles.locals.next ],
                events: {
                    'click': () => {
                        this.get('nextBtnWrap').trigger('activate:spinner');
                        this.trigger('clickedNextEpisode');
                    },
                    'activate:spinner': () => {
                        this.get('nextBtnWrap').addClass( styles.locals.show );
                        this.get('nextBtn')
                            .text('Next Episode')
                            .append(
                                $('<div/>').addClass( styles.locals.spinner )
                            );
                    }
                },
                children: [
                    {
                        tag: 'button',
                        ref: 'nextBtn',
                        text: '►  Next Episode'
                    }
                ]
            })
        }

        // # RENDER #

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
                    children: episodeButtons
                }
            ]

        }
    }
}