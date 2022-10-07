import {Module} from "../module.js";

export interface Cfg {
    data?: any[]
    change_event?: any
    value_attr?: string
    label_attr?: string
    value?: string
}

export interface Change_event {
    value: string
}

export class Dropdown extends Module {
    cfg: Cfg;
    select: HTMLSelectElement;

    constructor(cfg?: Cfg) {
        super();
        this.cfg = cfg;
        if (cfg.data && typeof cfg.data[0] == 'object') {
            if (!cfg.value_attr) cfg.value_attr = 'value'
            if (!cfg.label_attr) cfg.label_attr = 'label'
        }
    }

    ui() {
        return this.render(`
            <select id="ID-select"></select>  
        `)
    }

    ui_done_event() {
        this.select = this.el('select') as HTMLSelectElement
        if (this.cfg.change_event) {
            this.change_event = this.cfg.change_event
        }
        if (this.cfg.data) this.update(this.cfg.data);
        if (this.cfg.value) this.value = this.cfg.value;
    }

    update(data) {
        let options;
        if (this.cfg.value_attr) {
            options = data.map(item => `
                <option value="${item[this.cfg.value_attr]}">${item[this.cfg.label_attr]}</option>
            `)
        } else {
            options = data.map(item => `
                <option>${item}</option>
            `)
        }
        this.select.innerHTML = options.join('\n')
    }

    get value() {
        return this.select.value
    }

    set value(value) {
        this.select.value = value
    }

    set data(data) {
        this.update(data)
    }

    set change_event(value) {
        this.cfg.change_event = value
        this.select.addEventListener('change', this._change_event.bind(this))
    }

    _change_event() {
        const event: Change_event = {
            value: this.value
        }
        this.cfg.change_event(event)
    }
}
