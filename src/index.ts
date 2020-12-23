import { knownFolders } from '@nativescript/core';
import { mapCss } from './lib';

export namespace TNSFontIcon {
    export const css: any = {}; // font icon collections containing maps of classnames to unicode
    // eslint-disable-next-line prefer-const
    export let paths: { [k: string]: string | object } = {}; // file paths to font icon collections
    export const debug: boolean = false;

    export function loadFile(name: string, path: string){
        if (debug) {
            console.log('----------');
            console.log(`Loading collection '${name}' from file: ${path}`);
        }
        const cssFile = knownFolders.currentApp().getFile(path);
        return new Promise<void>((resolve, reject) => {
            cssFile.readText().then(
                data => {
                    const map = mapCss(data, debug);
                    css[name] = map;
                    resolve();
                },
                err => {
                    reject(err);
                }
            );
        });
    }
    function loadFileSync (name: string, path: string) {
        if (debug) {
            console.log('----------');
            console.log(`Loading collection '${name}' from file: ${path}`);
        }
        const cssFile = knownFolders.currentApp().getFile(path);
        // return new Promise((resolve, reject) => {
        const data = cssFile.readTextSync();
        const map = mapCss(data, debug);
        css[name] = map;
        // });
    };
    function parseAndMapCSS(name: string, data: string) {
        if (debug) {
            console.log('----------');
            console.log(`Loading collection '${name}' from data ${data}`);
        }
        css[name] = mapCss(data, debug);
    };

    export function loadCss() {
        if (debug) {
            console.log(`Collections to load: ${paths}`);
        }
        // return new Promise(() => {
        return Promise.all(
            Object.keys(paths).map(currentName => {
                css[currentName] = {};
                const data = paths[currentName];
                if (!data) {
                    return;
                }
                if (typeof data === 'string') {
                    return loadFile(currentName, data);
                } else {
                    return parseAndMapCSS(currentName, data[0][1]);
                }
            })
        );
    }
    export function loadCssSync()  {
        if (debug) {
            console.log(`Collections to load: ${paths}`);
        }
        Object.keys(paths).map(currentName => {
            css[currentName] = {};
            const data = paths[currentName];
            if (!data) {
                return;
            }
            if (typeof data === 'string') {
                return loadFileSync(currentName, data);
            } else {
                return parseAndMapCSS(currentName, data[0][1]);
            }
        });
    }
}

export function fonticon(values: string | string[]): string {
    if (!values) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        values = [values];
    }
    if (TNSFontIcon.debug) {
        console.log(`fonticon: ${values}`);
    }
    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        if (value.indexOf('-') > -1) {
            const prefix = value.split('-')[0];
            const result = TNSFontIcon.css[prefix][value];
            if (TNSFontIcon.debug) {
                console.log(`found fonticon ${result} for ${values}`);
            }
            if (result) {
                return result;
            }
        } else {
            // console.log("Fonticon classname did not contain a prefix. i.e., 'fa-bluetooth'");
            return value;
        }
    }
    return values[0];
}
