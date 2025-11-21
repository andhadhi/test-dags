import { TaskInfo, TaskStatus, TaskResult, AndhadhiConfig } from './types';
import { Logger } from './logger';
export declare class AndhadhiContext {
    private taskInfo;
    private httpClient;
    logger: Logger;
    constructor(config?: AndhadhiConfig);
    getTaskInfo(): TaskInfo;
    getEnv(name: string, defaultValue?: string): string | undefined;
    getSecret(name: string): string | undefined;
    getAllEnv(): Record<string, string>;
    getVariable(name: string): string | undefined;
    getSecretValue(name: string): string | undefined;
    getTaskResult(taskName: string): Promise<TaskResult | null>;
    updateStatus(status: TaskStatus): Promise<void>;
    setResult(result: TaskResult): Promise<void>;
    complete(status: TaskStatus, result?: TaskResult): Promise<void>;
    succeed(result?: TaskResult): Promise<void>;
    fail(error?: any): Promise<void>;
    markRunning(): Promise<void>;
    run<T = any>(taskFn: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=context.d.ts.map