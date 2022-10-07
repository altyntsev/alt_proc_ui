function log(...args) {
    let msg = '', value;
    for (let i = 0; i < arguments.length; i++) {
        value = arguments[i];
        if (typeof value === typeof {}) {
            value = JSON.stringify(value);
        }
        msg += value + ' ';
    }
    console.log(msg);
}
function el(selector, wc) {
    if (selector === undefined)
        throw 'Undefined';
    const obj = (wc === undefined) ? document : wc.shadow;
    const els = obj.querySelectorAll(selector);
    if (els.length === 0)
        throw 'Element not exists: ' + selector;
    if (els.length > 1)
        throw 'More than one elements: ' + selector;
    return els[0];
}
function els(selector) {
    if (selector === undefined)
        throw 'Undefined';
    return document.querySelectorAll(selector);
}
function valid(value) {
    if (value === undefined)
        throw 'Undefined';
    if (typeof value === typeof {})
        for (const attr in value)
            if (value[attr] === undefined)
                throw 'Undefined';
    return value;
}
function ajax_error(msg) {
    console.log('ERROR:', msg);
    const error_el = el('#error');
    const request_el = el('#request');
    error_el.innerHTML = msg;
    error_el.innerHTML = error_el.innerHTML.replace('color: red', 'color: black');
    request_el.style.color = 'lightpink';
    request_el.innerHTML = '! Error !';
    throw new Error(msg);
}
function ajax_ok() {
    const error_el = el('#error');
    const request_el = el('#request');
    error_el.innerHTML = '';
    request_el.innerHTML = '';
    request_el.style.color = 'yellow';
}
async function ajax_post(url = '', data = {}) {
    if (url == '') {
        url = window.location.pathname.replace('/html/', '/');
    }
    url = app.cfg.api + url;
    console.log('Request ...');
    el('#request').innerHTML = 'Request ...';
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic " + btoa(app.cfg.user + ":" + app.cfg.pwd)
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
    }
    catch (err) {
        ajax_error('Exception');
    }
    if (response.ok) {
        ajax_ok();
    }
    else {
        ajax_error(await response.text());
    }
    return response.json();
}
async function ajax_get(url = '', params = {}) {
    if (url == '') {
        url = window.location.pathname.replace('/html/', '/') + window.location.search;
    }
    else {
        url = url + '?' + new URLSearchParams(params);
    }
    url = app.cfg.api + url;
    console.log('Request ...');
    el('#request').innerHTML = 'Request ...';
    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            headers: { "Authorization": "Basic " + btoa(app.cfg.user + ":" + app.cfg.pwd) }
        });
    }
    catch (err) {
        ajax_error('Exception');
    }
    if (response.ok) {
        ajax_ok();
    }
    else {
        ajax_error(await response.text());
    }
    return response.json();
}
function empty(obj) {
    return Object.keys(obj).length === 0;
}
function set_active_menu(item) {
    el('#menu-' + item).classList.add('menu_active');
}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function save_history(url, title) {
    if (localStorage.history === undefined)
        localStorage.history = JSON.stringify([]);
    let history = JSON.parse(localStorage.history);
    if (url === undefined) {
        const h1 = els('h1');
        if (h1.length === 0)
            return;
        url = window.location.href;
        title = h1[0].innerHTML;
    }
    history = history.filter(item => item.url !== url);
    history.unshift({
        url: url,
        title: title
    });
    while (history.length > 30)
        history.pop();
    localStorage.history = JSON.stringify(history);
}
function var_type(obj) {
    if (Array.isArray(obj))
        return 'array';
    else
        return typeof obj;
}
function logout() {
    if (confirm('Выйти?'))
        location.href = '/logout';
}
function value_in_array(value, array) {
    return array.indexOf(value) != -1;
}
function get_url_params() {
    const url = new URL(window.location.href);
    const params = {};
    for (const [attr, value] of url.searchParams) {
        params[attr] = value;
    }
    return params;
}
function set_url_params(params) {
    let url = new URL(window.location.href);
    for (const param of Array.from(url.searchParams.keys())) {
        url.searchParams.delete(param);
    }
    for (const param in params) {
        if (params[param] === '' || params[param] === null || params[param] === undefined)
            continue;
        url.searchParams.append(param, params[param]);
    }
    window.history.replaceState("", "", url.toString());
}
function load_script(url) {
    var script = document.createElement("script"); // create a script DOM node
    script.src = url; // set its src to the provided URL
    script.async = false;
    script.defer = false;
    document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
function load_css(url) {
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", url);
    document.getElementsByTagName("head")[0].appendChild(element);
}
function range(n) {
    const ind = [];
    for (let i = 0; i < n; i++)
        ind.push(i);
    return ind;
}
function show_error(error) {
    el('#error').innerHTML = error;
}
function datetime_format(dt) {
    if (dt == null)
        return '';
    dt = dt.replace('T', ' ').substring(0, 19);
    return dt;
}
function datetime_diff_format(dt_iso) {
    const dt = new Date(dt_iso);
}
function array_index(arr, tag) {
    const ind = {};
    for (const item of arr) {
        if (!(item[tag] in ind))
            ind[item[tag]] = [];
        ind[item[tag]].push(item);
    }
    return ind;
}
