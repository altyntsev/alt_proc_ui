import { Module } from "../module.js";
export class Checkbox extends Module {
    constructor(cfg = {}) {
        super();
        this.cfg = cfg;
    }
    ui() {
        return this.render(`
            <input type="checkbox" id="ID-input"/> 
        `);
    }
    ui_done_event() {
        this.input = this.el('input');
        if (this.cfg.value)
            this.input.checked = true;
        if (this.cfg.change_event)
            this.input.addEventListener('change', this._change_event.bind(this));
    }
    get value() {
        return this.input.checked;
    }
    set value(value) {
        this.input.checked = value;
    }
    get data() {
        return this.cfg.data;
    }
    set change_event(handler) {
        this.cfg.change_event = handler;
        this.input.addEventListener('change', this._change_event.bind(this));
    }
    _change_event(ev) {
        if (!this.cfg.change_event)
            return;
        const event = {
            type: 'change',
            src: this,
            value: this.input.checked,
            data: this.cfg.data
        };
        this.cfg.change_event(event);
    }
}
