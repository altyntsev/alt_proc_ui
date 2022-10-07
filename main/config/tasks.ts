import {Module} from "../_libs/module.js";
import * as UI from "../_libs/ui/_import.js"
import {Task} from '../_types.js'

declare var app: Main

interface Response {
    tasks: Task[]
}


export class Main extends Module {
    cfg: any

    constructor(cfg) {
        super();
        this.cfg = cfg
    }

    async ui() {
        set_active_menu('config')

        const res: Response = await ajax_get('/task/list')

        return this.render(`
            <a class="button" href="/html/config/edit_task?task_id=new&type=PERIODIC">New PERIODIC task</a>
            <a class="button" href="/html/config/edit_task?task_id=new&type=EVENT">New EVENT task</a>
            <gap/>
            ${this.table_ui(res.tasks)}
        `)
    }

    table_ui(tasks: Task[]) {
        const header = `
            <tr>
                <th>type</th>
                <th>project</th>
                <th>name</th>
                <th>status</th>
                <th>period</th>
                <th>priority</th>
                <th>n_fatals</th>
                <th>n_runs</th>
            </tr>
            `
        const rows = tasks.map(task => `
            <tr>
                <td>${task.type}</td>
                <td>${task.project}</td>
                <td><a href="/html/config/edit_task?task_id=${task.task_id}">${task.name}</a></td>
                <td>${task.status}</td>
                <td>${task.period}</td>
                <td>${task.priority}</td>
                <td>${task.n_fatals}</td>
                <td>${task.n_runs}</td>
            </tr>
            `).join('\n')
        return `
            <table>
                ${header}
                ${rows}
            </table>
        `
    }
}


