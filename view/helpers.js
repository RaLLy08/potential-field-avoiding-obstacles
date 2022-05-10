/**
 * subscribes and initialize all public properties from ls
 * @param {object} object
 */

function withLsSubscribe(object) {
    // init
    for (const key of Object.keys(object)) {
        object[key] = +localStorage.getItem(key);
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

function onCheckboxChange(el, listener) {
    el.onchange = (e) => void listener(+e.target.checked);
}

function initCheckbox(el, value) {
    el.checked = value;
}