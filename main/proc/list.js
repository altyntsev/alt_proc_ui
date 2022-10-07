import { Module } from "../_libs/module.js";
import * as UI from "../_libs/ui/_import.js";
import { Params } from "../_libs/params.js";
export class Main extends Module {
    constructor(cfg) {
        super();
        this.cfg = cfg;
        this.params = new Params({
            url_get_mode: true,
            auto_apply: true,
            apply_event: this.refresh.bind(this)
        });
    }
    async refresh(params) {
        const res = await ajax_post('', params);
        this.procs = res.procs;
        el('#table').innerHTML = this.table_ui(this.procs);
    }
    async init_before_ui() {
        const res = await ajax_get('/task/list');
        const tasks = res.tasks.map(task => task.name);
        this.params.add('limit', new UI.Dropdown({
            data: [30, 100, 500]
        }));
        this.params.add('task', new UI.Dropdown({
            data: [''].concat(tasks)
        }));
        this.params.add('status', new UI.Dropdown({
            data: ['', 'WAIT', 'RUN', 'DONE']
        }));
        this.params.add('result', new UI.Dropdown({
            data: ['', 'FATAL', 'ERRORS', 'SUCCESS']
        }));
    }
    async init_after_ui() {
        set_active_menu('procs');
        this.params.init();
    }
    // ----------------------------------------------------------------------------------------------
    async ui() {
        return this.render(`
            ${this.css()}
            <div class="hor_center">
                Limit: ${this.params.module('limit').ui()}
                <gap/>
                Tasks: ${this.params.module('task').ui()}
                <gap/>
                Status: ${this.params.module('status').ui()}
                <gap/>
                Result: ${this.params.module('result').ui()}
            </div>
            <gap/>
            <div id="table"></div>
        `);
    }
    table_ui(procs) {
        const header = `
            <tr>
                <th>proc_id</th>
                <th>task</th>
                <th>title</th>
                <th>status</th>
                <th>result</th>
                <th>scripts</th>
            </tr>
            `;
        const rows = [];
        for (const proc of procs) {
            const scripts = [];
            let script;
            for (script of proc.scripts || []) {
                const status = script.status == 'DONE' ? script.result : script.status;
                scripts.push(`
                    <a class="script ${status}" href="/html/proc/info?proc_id=${script.proc_id}">
                        ${script.name}
                    </a>
                    `);
            }
            rows.push(`
                <tr>
                    <td><a href="/html/proc/info?proc_id=${proc.proc_id}">${proc.proc_id}</a></td>
                    <td>${proc.task}</td>
                    <td>${proc.title}</td>
                    <td class="${proc.status}">${proc.status}</td>
                    <td class="${proc.result}">${proc.result}</td>
                    <td>${scripts.join('\n')}</td>
                </tr>
                `);
        }
        return this.render(`
            <table>
                ${header}
                ${rows.join('\n')}
            </table>
        `);
    }
    css() {
        return `
            <style>
                .script {
                    padding: 2px;
                    margin: 0;
                }
            </style>
        `;
    }
}
