import { Module } from "../_libs/module.js";
import * as UI from "../_libs/ui/_import.js";
export class Main extends Module {
    constructor(cfg) {
        super();
        this.cfg = cfg;
    }
    async refresh() {
        const res = await ajax_get('');
        el('#host').innerHTML = this.host_ui(res.launcher_mtime, res.launcher_status);
        el('#tasks').innerHTML = this.tasks_ui(res.tasks);
        this.send_ui_done_event();
    }
    async ui() {
        set_active_menu('status');
        return this.render(`
            ${this.css()}
            <div class="hor_center" id="host"></div>
            <div id="tasks"></div>
        `);
    }
    // -----------------------------------------------------------------------------------
    async status_event(ev) {
        const { task, status } = ev.data;
        await ajax_post('/task/set_status', { task_id: task.task_id, status: status });
        this.refresh();
    }
    async launcher_status_event(ev) {
        await ajax_post('/cmds/set_status', { status: ev.value });
        this.refresh();
    }
    // -----------------------------------------------------------------------------------
    host_ui(launcher_mtime, launcher_status) {
        const status_button = new UI.Dropdown({
            data: ['RUN', 'PAUSE', 'EXIT'],
            value: launcher_status,
            change_event: this.launcher_status_event.bind(this)
        });
        return this.render(`
            Status: ${status_button.ui()}
            <gap/>
            Mtime: ${launcher_mtime.split(' ')[2]}
        `);
    }
    tasks_ui(tasks) {
        //region header html
        const header = `
            <tr>
                <th>project</th>
                <th>name</th>
                <th></th>
                <th>events</th>
                <th>wait</th>
                <th>run</th>
                <th colspan="2">done</th>
                <th>status</th>
                <th>result</th>
                <th>scripts</th>
            </tr>
        `;
        //endregion
        const rows = [];
        for (let itask = 0; itask < tasks.length; itask++) {
            const task = tasks[itask];
            // fill project_rowspan
            let project_rowspan;
            const new_project_row = itask == 0 || tasks[itask].project != tasks[itask - 1].project;
            if (new_project_row) {
                let i;
                for (i = itask + 1; i < tasks.length; i++) {
                    if (tasks[i].project != task.project)
                        break;
                }
                project_rowspan = i - itask;
            }
            // fill scripts
            const scripts = [];
            let script;
            for (script of task.scripts || []) {
                const status = script.status == 'DONE' ? script.result : script.status;
                scripts.push(`
                    <a class="script ${status}" href="/html/proc/info?proc_id=${script.proc_id}">
                        ${script.name}
                    </a>
                    `);
            }
            // controls
            const status_uis = [];
            for (const status of ['ACTIVE', 'PAUSE', 'DEBUG']) {
                if (task.status != status) {
                    const status_button = new UI.Button({
                        label: status.substr(0, 1),
                        class: status,
                        click_event: this.status_event.bind(this),
                        data: { task: task, status: status }
                    });
                    status_uis.push(`
                        ${status_button.ui()}
                    `);
                }
            }
            //region rows html
            const n_wait = task.n_wait_procs && task.type == 'EVENT';
            const n_run = task.n_run_procs && task.type == 'EVENT';
            const n_success = task.n_success_procs && task.type == 'EVENT';
            const n_fatal = task.n_fatal_procs && task.type == 'EVENT';
            rows.push(`
                <tr>
                    ${(new_project_row) ? `<td rowspan="${project_rowspan}">${task.project}</td>` : ''}
                    <td class="${task.status}">
                        <a class="${task.status}" href="/html/config/edit_task?task_id=${task.task_id}">
                            ${task.name}</a>
                    </td>
                    <td>${status_uis.join('\n')}</td>
                    <td class="${task.n_events ? 'WAIT' : ''}">${task.n_events}</td>
                    <td class="${n_wait ? 'WAIT' : ''}">${n_wait ? `
                        <a class="WAIT" href="/html/proc/list?status=WAIT&task=${task.name}">
                            ${task.n_wait_procs}
                        </a>
                        ` : ''}
                    </td>
                    <td class="${n_run ? 'RUN' : ''}">${n_run ? `
                        <a class="RUN" href="/html/proc/list?status=RUN&task=${task.name}">
                            ${task.n_run_procs}
                        </a>
                        ` : ''}
                    </td>
                    <td class="${n_success ? 'SUCCESS' : ''}">${n_success ? `
                        <a class="SUCCESS" href="/html/proc/list?status=DONE&result=SUCCESS&task=${task.name}">
                            ${task.n_success_procs}
                        </a>
                        ` : ''}
                    </td>
                    <td class="${n_fatal ? 'FATAL' : ''}">${n_fatal ? `
                        <a class="FATAL" href="/html/proc/list?status=DONE&result=FATAL&task=${task.name}">
                            ${task.n_fatal_procs}
                        </a>
                        ` : ''}
                    </td>
                    <td class="${task.last_proc_status}">${task.last_proc_status}</td>
                    <td class="${task.last_proc_result}">${task.last_proc_result}</td>
                    <td>${scripts.join('\n')}</td>
                </tr>
                `);
            //endregion
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
