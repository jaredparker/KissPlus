
// Format name to use for storage
export const storageVariables = {
    event: ( catergory, event ) => `__EVENT__${catergory}__${event}__`,
    dict:  ( name ) => `__DICTIONARY__${name}__`,
    tab:   () => `__TYPEDATA__`
}

export const types = {

    tab: {
        CONTROLLER: 'controller',
        PLAYER: 'player'
    },

    episode: {
        PREVIOUS: 'previous',
        CURRENT: 'current',
        NEXT: 'next'
    },

    event: {
        TRIGGER: 'trigger',
        CALLBACK: 'callback'
    }
}

// CSS Class names
// ~ random just so low chance of interfering with other elements
export const classes = {
    content:         '_75200a96',

    videoController: '_3c68ff78',

    episodeButtons:  '_b06d2ba0',
    nextButton:      '_05113d3d',
    nextButtonWrap:  '_c0eb7399',
    prevButton:      '_25a36022',
    prevButtonWrap:  '_5e388414',
    spinner:         '_ec3c0535',

    title:           '_bf6cea90',
    close:           '_6cf42d87',

    openVideoTab:    '_d561277f'
}

// CSS Sizes
export const sizes = {
    edgePadding:       '80px',
    nextButtonPadding: '20px',
    nextButtonHover:   '10px'
}