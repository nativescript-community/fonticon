import { knownFolders } from 'tns-core-modules/file-system';
import { profile } from 'tns-core-modules/profiling';
import * as lib from './lib';

export class TNSFontIcon {
    public static css: any = {}; // font icon collections containing maps of classnames to unicode
    public static paths: { [k: string]: string | object } = {}; // file paths to font icon collections
    public static debug: boolean = false;

    private static loadFile = profile(
        'loadCSS',
        (name: string, path: string): Promise<any> => {
            if (TNSFontIcon.debug) {
                console.log('----------');
                console.log(`Loading collection '${name}' from file: ${path}`);
            }
            const cssFile = knownFolders.currentApp().getFile(path);
            return new Promise((resolve, reject) => {
                cssFile.readText().then(
                    data => {
                        const map = lib.mapCss(data, TNSFontIcon.debug);
                        TNSFontIcon.css[name] = map;
                        resolve();
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        }
    );
    private static loadFileSync = profile('loadCSS', (name: string, path: string) => {
        if (TNSFontIcon.debug) {
            console.log('----------');
            console.log(`Loading collection '${name}' from file: ${path}`);
        }
        const cssFile = knownFolders.currentApp().getFile(path);
        // return new Promise((resolve, reject) => {
        const data = cssFile.readTextSync();
        const map = lib.mapCss(data, TNSFontIcon.debug);
        TNSFontIcon.css[name] = map;
        // });
    });
    private static parseAndMapCSS = profile('parseAndMapCSS', (name: string, data: string) => {
        if (TNSFontIcon.debug) {
            console.log('----------');
            console.log(`Loading collection '${name}' from data ${data}`);
        }
        TNSFontIcon.css[name] = lib.mapCss(data, TNSFontIcon.debug);
    });

    public static loadCss = (): Promise<any> => {
        if (TNSFontIcon.debug) {
            console.log(`Collections to load: ${TNSFontIcon.paths}`);
        }
        // return new Promise(() => {
        return Promise.all(
            Object.keys(TNSFontIcon.paths).map(currentName => {
                TNSFontIcon.css[currentName] = {};
                const data = TNSFontIcon.paths[currentName];
                if (!data) {
                    return;
                }
                if (typeof data === 'string') {
                    return TNSFontIcon.loadFile(currentName, data);
                } else {
                    return TNSFontIcon.parseAndMapCSS(currentName, data[0][1]);
                }
            })
        );

        // if (cnt < fontIconCollections.length) {
        //     loadFile(TNSFontIcon.paths[currentName]).then(() => {
        //         cnt++;
        //         return loadFiles().then(() => {
        //             resolve();
        //         });
        //     });
        // } else {
        //     resolve();
        // }
        // });
    }
    public static loadCssSync = () => {
        if (TNSFontIcon.debug) {
            console.log(`Collections to load: ${TNSFontIcon.paths}`);
        }
        // return new Promise(() => {
        // return Promise.all(
        Object.keys(TNSFontIcon.paths).map(currentName => {
            TNSFontIcon.css[currentName] = {};
            const data = TNSFontIcon.paths[currentName];
            if (!data) {
                return;
            }
            if (typeof data === 'string') {
                return TNSFontIcon.loadFileSync(currentName, data);
            } else {
                return TNSFontIcon.parseAndMapCSS(currentName, data[0][1]);
            }
        });
        // );

        // if (cnt < fontIconCollections.length) {
        //     loadFile(TNSFontIcon.paths[currentName]).then(() => {
        //         cnt++;
        //         return loadFiles().then(() => {
        //             resolve();
        //         });
        //     });
        // } else {
        //     resolve();
        // }
        // });
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
