export class Module {
    constructor() {
        this.ID = 'app-auto-' + Module.next_ID.toString();
        Module.next_ID += 1;
        Module.ui_done_event_modules.push(this);
    }
    init_child_IDs() {
        if (!this.ID)
            throw 'ID undefined';
        for (const attr in this) {
            const m = this[attr];
            if (!(m instanceof Module))
                continue;
            if (m instanceof Module && (!m.ID || m.ID.startsWith('app-auto-'))) {
                m.ID = this.ID + '-' + attr;
                m.parent = this;
                m.init_child_IDs();
            }
        }
    }
    el(element_id) {
        const elem = document.getElementById(this.ID + '-' + element_id);
        if (elem == undefined)
            throw 'Unknown element ID: ' + this.ID + '-' + element_id;
        return elem;
    }
    sel(selector) {
    }
    class(class_name) {
        return [...document.querySelectorAll('.' + this.ID + '-' + class_name)];
    }
    render(html) {
        html = html.replaceAll('ID-', this.ID + '-');
        html = html.replaceAll('<gap/>', '<div class="gap"></div>');
        html = html.replaceAll('null', ' ');
        html = html.replaceAll('undefined', ' ');
        return html;
    }
    event_id(ev) {
        return ev.target.id.substring(this.ID.length + 1);
    }
    init_childs() {
        for (const attr in this) {
            const m = this[attr];
            if (m instanceof Module) {
                m.init_childs();
                m.init();
            }
        }
    }
    init() {
    }
    check_IDs_iter(ids) {
        for (const attr in this) {
            const m = this[attr];
            if (m instanceof Module) {
                if (m.ID == undefined)
                    throw 'Undefined id';
                if (ids.has(m.ID))
                    throw 'Duplicated id:' + m.ID;
                ids.add(m.ID);
                m.check_IDs_iter(ids);
            }
        }
    }
    check_IDs() {
        const ids = new Set();
        this.check_IDs_iter(ids);
    }
    send_ui_done_event() {
        for (const ui of Module.ui_done_event_modules)
            if ('ui_done_event' in ui)
                ui.ui_done_event();
        Module.ui_done_event_modules = [];
    }
}
Module.next_ID = 0;
Module.ui_done_event_modules = [];
