import { LogLevel } from './types';
export declare class Logger {
    private taskRunId?;
    private dagName?;
    private taskName?;
    private debug;
    constructor(taskRunId?: string, dagName?: string, taskName?: string, debug?: boolean);
    private createLogEntry;
    private write;
    debugLog(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    error(message: string, metadata?: Record<string, any>): void;
    log(level: LogLevel, message: string, metadata?: Record<string, any>): void;
}
//# sourceMappingURL=logger.d.ts.map