export interface Task {
    task_id: number | 'new'
    type: 'EVENT' | 'PERIODIC' | 'DAEMON'
    project: string
    name: string
    status: 'ACTIVE' | 'PAUSE' | 'FATAL' | 'DELETED' | 'DEBUG'
    period?: number
    priority: number
    n_fatals: number
    n_runs: number
}

export interface Event {
    event_id: number
    task_id: number
    title: string
    status: 'WAIT' | 'USED'
    params: any
    ctime: string
}

export interface Proc {
    proc_id: number
    event_id: number
    status: 'WAIT' | 'RUN' | 'DONE' | 'DELETED'
    result?: 'SUCCESS' | 'FATAL' | 'ERRORS'
    ctime: string
    stime?: string
    etime?: string
    mtime?: string
    run_at?: string
    os_pid?: number
    data?: any
}

export interface Script {
    script_id: number
    proc_id: number
    iscript: number
    path: string
    name: string
    status: 'WAIT' | 'NEXT' | 'RUN' | 'DONE'
    result: 'SUCCESS' | 'FATAL' | 'ERRORS'
    resources: any
    stime?: string
    etime?: string
    n_runs: number
}
