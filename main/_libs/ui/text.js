import { Module } from "../module.js";
export class Text extends Module {
    constructor(cfg = {}) {
        super();
        this.cfg = cfg;
    }
    ui() {
        return this.render(`
            <textarea id="ID-input" rows="${this.cfg.rows}" style="width: ${this.cfg.width}px"></textarea> 
        `);
    }
    ui_done_event() {
        this.input = this.el('input');
        if (this.cfg.value)
            this.input.value = this.cfg.value;
        if (this.cfg.change_event)
            this.input.addEventListener('change', this._change_event.bind(this));
    }
    get value() {
        return this.input.value.trim();
    }
    set value(value) {
        this.input.value = value;
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
            value: this.value
        };
        this.cfg.change_event(event);
    }
}
