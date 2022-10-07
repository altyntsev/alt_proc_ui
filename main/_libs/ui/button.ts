import {Module, Module_event} from "../module.js";

interface Cfg {
    label: string
    click_event?: any
    data?: any
    style?: string[]
    css?: string
    class?: string
}

export class Button extends Module {
    button: HTMLButtonElement;
    cfg: Cfg

    constructor(cfg?: Cfg) {
        super();
        this.cfg = cfg
        if (!this.cfg.style) this.cfg.style = []
        if (!this.cfg.class) this.cfg.class = ''
    }

    ui() {
        return this.render(`
            ${this.css()}
            <button id="ID-button" class="${this.cfg.class}">${this.cfg.label}</button> 
        `)
    }

    ui_done_event() {
        this.button = this.el('button') as HTMLButtonElement
        if (this.cfg.click_event) this.button.addEventListener('click', this.click_event.bind(this))
    }

    get data() {
        return this.cfg.data
    }

    click_event() {
        if (!this.cfg.click_event) return
        const event: Module_event = {
            type: 'click',
            src: this,
            data: this.cfg.data
        }
        this.cfg.click_event(event)
    }

    css() {
        if (this.cfg.css)
            return `
            <style>
                #ID-button {
                    ${this.cfg.css}
                }
            </style>
            `
        return `
            <style>
                #ID-button {
                    ${value_in_array('alarm', this.cfg.style) ? ` 
                        background-color: red !important;
                    ` : ''}
                    ${value_in_array('compact', this.cfg.style) ? ` 
                        padding: 0;
                    ` : ''}
                }
            </style>
        `
    }
}
