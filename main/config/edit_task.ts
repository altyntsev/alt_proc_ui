import {Module} from "../_libs/module.js";
import {Params} from "../_libs/params.js";
import * as UI from "../_libs/ui/_import.js"
import {Task} from "../_types.js"

declare var app: Main

interface URL_params {
    task_id: number | 'new'
    type?: 'EVENT' | 'PERIODIC' | 'DAEMON'
}

export class Main extends Module {
    cfg: any
    params: Params
    url_params: URL_params
    task_id: number | 'new'
    task_type?: 'EVENT' | 'PERIODIC' | 'DAEMON'
    task?: Task

    constructor(cfg) {
        super();
        this.cfg = cfg
        this.params = new Params()
    }

    async init_before_ui() {
        this.url_params = get_url_params()
        this.task_id = this.url_params.task_id
        if (this.task_id == 'new') {
            this.task_type = this.url_params.type
        } else {
            this.task = await ajax_get('/task/info', {task_id: this.task_id})
            this.task_type = this.task.type
        }
    }

    async init_after_ui() {
        if (this.task_id != 'new') {
            this.params.set_params(this.task)
        }
    }

    // -------------------------------------------------------------------------------------------------------
    async ui() {
        set_active_menu('config')

        const rows = []
        rows.push(`
            <tr><th>Task type</th><td>${this.task_type}</td></tr>
        `)

        if (this.task_id == 'new') {
            this.params.add('name', new UI.Input({size:20}))
            this.params.add('project', new UI.Input({size: 30}))
            rows.push(`    
                <tr><th>Task Name*</th><td>${this.params.module('name').ui()}</td></tr>
                <tr><th>Project*</th><td>${this.params.module('project').ui()}</td></tr>
                `)
        } else {
            rows.push(`    
                <tr><th>Task Name*</th><td>${this.task.name}</td></tr>
                <tr><th>Project*</th><td>${this.task.project}</td></tr>
                `)
        }
        if (this.task_type == 'EVENT') {
            this.params.add('priority', new UI.Dropdown({
                data: [0, 1, 2, 3]
            }))
            this.params.add('n_fatals', new UI.Dropdown({
                data: [1, 3, 5]
            }))
            this.params.add('n_runs', new UI.Dropdown({
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            ))
            rows.push(`    
                <tr><th>Priority</th><td>${this.params.module('priority').ui()}</td></tr>
                <tr><th>N fatals</th><td>${this.params.module('n_fatals').ui()}</td></tr>
                <tr><th>N runs</th><td>${this.params.module('n_runs').ui()}</td></tr>
                `)
        }
        if (this.task_type == 'PERIODIC') {
            this.params.add('period', new UI.Input())
            rows.push(`    
                <tr><th>Period</th><td>${this.params.module('period').ui()}</td></tr>
                `)
        }
        const save_button = new UI.Button({
            label: 'Save Task',
            click_event: this.save_event.bind(this)
        })

        return this.render(`
            ${this.css()}
            <table>
                ${rows.join('\n')}
            </table>
            <gap/>
            ${save_button.ui()}
        `)
    }

    async ui_event_done() {
        if (this.url_params.task_id != 'new') {
            this.params
        }
    }

    async save_event() {
        const task = this.params.get_params() as Task
        task.task_id = this.url_params.task_id
        task.type = this.task_type
        await ajax_post('/task/save', task)
        window.location.href = '/html/config/tasks'
    }

    css() {
        return `
            <style>
                table, tr, td, th {
                    border: none !important;
                }
            </style>
        `
    }
}


