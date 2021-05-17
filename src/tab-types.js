
// ### IMPORTS ###

import { GM_findTab } from "./gm-extras";
import { storageVariables } from "./config";

// ### INIT ###

const typeData = storageVariables.tab();

// ### MAIN ###
// - Used to check if tabs open

export function setTabType( catergory, type ){
    return new Promise( ( resolve, reject ) => {
        GM_getTab( tab => {
            tab[ typeData ] = { catergory, type };
            GM_saveTab( tab );
            resolve();
        });
    });
}

export function removeTabType(){
    return new Promise( ( resolve, reject ) => {
        GM_getTab( tab => {
            delete tab[ typeData ];
            GM_saveTab( tab );
            resolve();
        });
    });
}

export function findTabType( catergory, type ){
    return new Promise( ( resolve, reject ) => {
        GM_findTab( tab =>

            tab[ typeData ] &&
            tab[ typeData ].catergory == catergory &&
            tab[ typeData ].type == type

        , resolve);
    });
}