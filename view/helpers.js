/**
 * subscribes and initialize all public properties from ls
 * @param {object} object
 */

export function withLsSubscribe(object) {
    // init
    for (const key of Object.keys(object)) {
        const item = localStorage.getItem(key);

        if (item == null) continue;

        object[key] = isNaN(item) ? item : +item;
    }

    const withListener = {
        set: (obj, prop, value) => {
            localStorage.setItem(prop, value);
            obj[prop] = value;
            return true;
        }
    }

    return new Proxy(object, withListener);
}
