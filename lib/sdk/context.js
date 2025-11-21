"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndhadhiContext = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
class AndhadhiContext {
    constructor(config = {}) {
        const taskRunId = process.env.ANDHADHI__TASK_RUN_ID;
        const dagId = process.env.ANDHADHI__DAG_ID;
        const runId = process.env.ANDHADHI__RUN_ID;
        const dagName = process.env.ANDHADHI__DAG_NAME;
        const taskName = process.env.ANDHADHI__TASK_NAME;
        const schedulerUrl = config.schedulerUrl || process.env.ANDHADHI__SCHEDULER_URL || 'http://scheduler-service:8080';
        if (!taskRunId || !dagId || !runId || !dagName || !taskName) {
            throw new Error('Missing required environment variables. Ensure this code is running inside an Andhadhi task. ' +
                'Required: ANDHADHI__TASK_RUN_ID, ANDHADHI__DAG_ID, ANDHADHI__RUN_ID, ANDHADHI__DAG_NAME, ANDHADHI__TASK_NAME');
        }
        this.taskInfo = {
            taskRunId,
            dagId,
            runId,
            dagName,
            taskName,
            schedulerUrl,
        };
        this.httpClient = axios_1.default.create({
            baseURL: schedulerUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.logger = new logger_1.Logger(this.taskInfo.taskRunId, this.taskInfo.dagName, this.taskInfo.taskName, config.debug || false);
        this.logger.info('AndhadhiContext initialized', {
            dagName: this.taskInfo.dagName,
            taskName: this.taskInfo.taskName,
            runId: this.taskInfo.runId,
        });
    }
    getTaskInfo() {
        return { ...this.taskInfo };
    }
    getEnv(name, defaultValue) {
        return process.env[name] || defaultValue;
    }
    getSecret(name) {
        const value = this.getEnv(name);
        if (!value) {
            this.logger.warn(`Secret '${name}' not found in environment`);
        }
        return value;
    }
    getAllEnv() {
        return { ...process.env };
    }
    getVariable(name) {
        return process.env[`ANDHADHI__VARIABLE__${name}`];
    }
    getSecretValue(name) {
        return process.env[`ANDHADHI__SECRET__${name}`];
    }
    async getTaskResult(taskName) {
        try {
            this.logger.info(`Fetching result for task '${taskName}'`);
            const response = await this.httpClient.get(`/task-runs/${this.taskInfo.runId}/${taskName}`);
            if (response.data && response.data.success) {
                const result = response.data.value.result;
                this.logger.debugLog(`Retrieved result for task '${taskName}'`, { result });
                return result;
            }
            return null;
        }
        catch (error) {
            if (error.response?.status === 404) {
                this.logger.warn(`Task '${taskName}' result not found`);
                return null;
            }
            this.logger.error(`Failed to fetch task result: ${error.message}`, {
                taskName,
                error: error.response?.data || error.message,
            });
            throw error;
        }
    }
    async updateStatus(status) {
        const payload = {
            task_run_id: this.taskInfo.taskRunId,
            status,
        };
        try {
            this.logger.info(`Updating task status to '${status}'`);
            await this.httpClient.post('/task-runs/update', payload);
            this.logger.debugLog(`Status updated successfully to '${status}'`);
        }
        catch (error) {
            this.logger.error(`Failed to update status: ${error.message}`, {
                status,
                error: error.response?.data || error.message,
            });
            throw error;
        }
    }
    async setResult(result) {
        const payload = {
            task_run_id: this.taskInfo.taskRunId,
            result: result,
        };
        try {
            this.logger.info('Storing task result');
            await this.httpClient.post('/task-runs/update', payload);
            this.logger.debugLog('Result stored successfully', { result });
        }
        catch (error) {
            this.logger.error(`Failed to set result: ${error.message}`, {
                error: error.response?.data || error.message,
            });
            throw error;
        }
    }
    async complete(status, result) {
        const payload = {
            task_run_id: this.taskInfo.taskRunId,
            status,
            result,
        };
        try {
            this.logger.info(`Completing task with status '${status}'`);
            await this.httpClient.post('/task-runs/update', payload);
            this.logger.info(`Task completed with status '${status}'`);
        }
        catch (error) {
            this.logger.error(`Failed to complete task: ${error.message}`, {
                status,
                error: error.response?.data || error.message,
            });
            throw error;
        }
    }
    async succeed(result) {
        await this.complete('succeeded', result);
    }
    async fail(error) {
        const errorResult = error instanceof Error
            ? { error: error.message, stack: error.stack }
            : { error: String(error) };
        this.logger.error('Task failed', errorResult);
        await this.complete('failed', errorResult);
    }
    async markRunning() {
        await this.updateStatus('running');
    }
    async run(taskFn) {
        try {
            await this.markRunning();
            const result = await taskFn();
            await this.succeed(result);
            return result;
        }
        catch (error) {
            await this.fail(error);
            throw error;
        }
    }
}
exports.AndhadhiContext = AndhadhiContext;
//# sourceMappingURL=context.js.map