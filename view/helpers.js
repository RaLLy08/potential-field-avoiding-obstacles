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

export function onCheckboxChange(el, listener) {
    el.onchange = (e) => void listener(+e.target.checked);
}

export function initCheckbox(el, value) {
    el.checked = value;
}

export function onSelectChange(el, listener) { 
    el.onchange = (e) => void listener(e.target.value);
}
