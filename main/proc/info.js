import { Module } from "../_libs/module.js";
class Res {
}
export class Main extends Module {
    constructor(cfg) {
        super();
        this.cfg = cfg;
    }
    async refresh() {
        const res = await ajax_get('');
        el('#tasks').innerHTML = this.task_ui(res.task);
        el('#events').innerHTML = this.event_ui(res.event);
        el('#procs').innerHTML = this.proc_ui(res.proc);
        el('#scripts').innerHTML = this.scripts_ui(res.scripts);
    }
    async ui() {
        set_active_menu('procs');
        return this.render(`
            <div class="hor">
                <div class="ver">
                    <div id="tasks"></div>
                    <gap/>
                    <div id="events"></div>
                    <gap/>
                    <div id="procs"></div>
                </div>
                <gap/>
                <div class="ver">
                    <div id="scripts"></div>
                </div>
            </div>
        `);
    }
    task_ui(task) {
        return this.render(`
            <h1>Task</h1>
            <table>
                <tr><th>task_id</th><td>${task.task_id}</td></tr>
                <tr><th>name</th><td>${task.name}</td></tr>
                <tr><th>project</th><td>${task.project}</td></tr>
                <tr><th>status</th><td class="${task.status}">${task.status}</td></tr>
            </table>
            `);
    }
    event_ui(event) {
        return this.render(`
            <h1>Event</h1>
            <table>
                <tr><th>event_id</th><td>${event.event_id}</td></tr>
                <tr><th>title</th><td>${event.title}</td></tr>
                <tr><th>status</th><td class="${event.status}">${event.status}</td></tr>
                <tr><th>params</th><td>${event.params}</td></tr>
                <tr><th>ctime</th><td>${event.ctime}</td></tr>
            </table>
            `);
    }
    proc_ui(proc) {
        return this.render(`
            <h1>Processing</h1>
            <table>
                <tr><th>proc_id</th><td>${proc.proc_id}</td></tr>
                <tr><th>status</th><td class="${proc.status}">${proc.status}</td></tr>
                <tr><th>result</th><td class="${proc.result}">${proc.result}</td></tr>
                <tr><th>ctime</th><td>${proc.ctime}</td></tr>
                <tr><th>stime</th><td>${proc.stime}</td></tr>
                <tr><th>etime</th><td>${proc.etime}</td></tr>
                <tr><th>mtime</th><td>${proc.mtime}</td></tr>
                <tr><th>run_at</th><td>${proc.run_at}</td></tr>
                <tr><th>os_pid</th><td>${proc.os_pid}</td></tr>
                <tr><th>data</th><td>${proc.data}</td></tr>
            </table>
            `);
    }
    scripts_ui(scripts) {
        const header = `
            <tr>
                <th>i</th>
                <th>name</th>
                <th>status</th>
                <th>result</th>
                <th>resources</th>
            </tr>
        `;
        const rows = [];
        for (const script of scripts) {
            rows.push(`
                <tr>
                    <td>${script.iscript}</td>
                    <td>${script.name}</td>
                    <td class="${script.status}">${script.status}</td>
                    <td class="${script.result}">${script.result}</td>
                    <td>${script.resources}</td>
                </tr>
                `);
        }
        return this.render(`
            <h1>Scripts</h1>
            <table>
                ${header}
                ${rows.join('\n')}
            </table>
            `);
    }
}
