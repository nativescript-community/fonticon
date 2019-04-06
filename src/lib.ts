// import { parse } from 'tns-core-modules/css';
import { profile } from 'tns-core-modules/profiling';

export const mapCss = profile(
    'mapCss',
    (data: string, debug?: boolean): object => {
        const map = {};
        // const test = parse(data, {});
        // console.log(test);
        const sets = data.split('}');

        for (const set of sets) {
            const pair = set.split('{');
            const preVal = pair[1];
            if (preVal && preVal.indexOf('content:') !== -1) {
                const keyGroups = pair[0];
                const keys = keyGroups.split(',');
                const value = cleanValue(preVal);
                if (!value) {
                    continue;
                }
                const realVal = String.fromCharCode(parseInt(value, 16));
                for (let key of keys) {
                    key = key
                        .trim() // remove spaces
                        .slice(1) // remove the .
                        .split(':before')[0]; // remove :before and anything after
                    map[key] = realVal;
                    if (debug) {
                        console.log(`${key}: ${value} ${realVal}`);
                    }
                }
            }
        }
        return map;
    }
);

export const cleanValue = (val: string): string | void => {
    const array = val.trim().split('"');
    if (array.length > 1) {
        return array[array.length - 2].substring(1);
    }
    return void 0;
};
