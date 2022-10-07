import {Module} from "./module.js";

interface Cfg {
    url_get_mode?: boolean // get and set url GET params
    apply_event?: any     // apply if param changed
    auto_apply?: boolean  // apply event
}

export class Params extends Module {
    cfg: Cfg
    modules: any;

    constructor(cfg: Cfg = {}) {
        super();
        this.cfg = cfg
        this.modules = {};
    }

    init() {
        if (this.cfg.url_get_mode) {
            this.set_params(get_url_params())
        }
        if (this.cfg.auto_apply) {
            if (!this.cfg.apply_event) throw 'apply_event empty'
            for (const param in this.modules) {
                this.modules[param].change_event = this.change_event.bind(this)
            }
            this.apply()
        }
    }

    add(param, module) {
        this.modules[param] = module;
    }

    module(param) {
        return this.modules[param]
    }

    set_params(params) {
        for (const param in this.modules) {
            if (params[param]) this.modules[param].value = params[param];
        }
    }

    get_params() {
        const params = {}
        let value;
        for (const param in this.modules) {
            value = this.modules[param].value
            if (typeof value === 'string') value = value.trim()
            if (value == '') continue
            params[param] = value
        }
        return params
    }

    apply() {
        const params = this.get_params()
        if (this.cfg.url_get_mode) {
            set_url_params(params)
        }
        if (this.cfg.apply_event) {
            this.cfg.apply_event(params)
        }
    }

    change_event() {
        this.apply()
    }
}
