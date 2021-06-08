
// Format name to use for storage
export const storageVariables = {
    event: ( catergory, event ) => `__EVENT__${catergory}__${event}__`,
    dict:  ( name             ) => `__DICTIONARY__${name}__`,
    tab:   (                  ) => `__TYPEDATA__`
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

export const openPlayerIconURL = 'https://i.imgur.com/UmWIUVF.png';
export const faviconURL        = 'https://i.imgur.com/Zctzveh.png';

export const awaitInterval = 300;
export const timeoutLeeway = 0.08;