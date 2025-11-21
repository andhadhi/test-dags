export type TaskStatus = 'pending' | 'running' | 'succeeded' | 'failed';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface TaskInfo {
    taskRunId: string;
    dagId: string;
    runId: string;
    dagName: string;
    taskName: string;
    schedulerUrl: string;
}
export type TaskResult = any;
export interface TaskRunUpdate {
    task_run_id: string;
    status?: TaskStatus;
    result?: TaskResult;
}
export interface AndhadhiConfig {
    schedulerUrl?: string;
    debug?: boolean;
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    taskRunId?: string;
    dagName?: string;
    taskName?: string;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=types.d.ts.map