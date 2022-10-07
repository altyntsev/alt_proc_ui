import { Module } from "../module.js";
export class Tabs extends Module {
    constructor(cfg) {
        super();
        this.cfg = cfg;
    }
    ui() {
        const tabs = [];
        for (const tab of this.cfg.tabs) {
            if (tab.link) {
                tabs.push(`<a id="ID-${tab.value}" href="${tab.link}">${tab.label}</a>`);
            }
            else {
                tabs.push(`<a role="button" id="ID-${tab.value}">${tab.label}</a>`);
            }
        }
        return this.render(`
            <div class="tabs">
                <span></span>
                ${tabs.join('\n')}
                <span></span>
            </div>
        `);
    }
    ui_done_event() {
        for (const tab of this.cfg.tabs) {
            if (tab.link)
                continue;
            this.el(tab.value).addEventListener('click', this.change_event.bind(this));
        }
    }
    set_active(value) {
        for (const tab of this.cfg.tabs) {
            if (tab.link)
                continue;
            this.el(tab.value).classList.remove('active');
            if (!tab.div_id)
                continue;
            el(`#${tab.div_id}`).style.display = 'none';
        }
        for (const tab of this.cfg.tabs) {
            if (tab.div_id && tab.value == value) {
                el(`#${tab.div_id}`).style.display = 'block';
            }
        }
        this.el(value).classList.add('active');
    }
    change_event(ev) {
        const event_value = ev.target.id.split('-').pop();
        this.set_active(event_value);
    }
}
