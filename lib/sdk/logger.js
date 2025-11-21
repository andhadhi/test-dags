"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(taskRunId, dagName, taskName, debug = false) {
        this.taskRunId = taskRunId;
        this.dagName = dagName;
        this.taskName = taskName;
        this.debug = debug;
    }
    createLogEntry(level, message, metadata) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            taskRunId: this.taskRunId,
            dagName: this.dagName,
            taskName: this.taskName,
            metadata,
        };
    }
    write(entry) {
        const output = JSON.stringify(entry);
        console.log(output);
    }
    debugLog(message, metadata) {
        if (this.debug) {
            this.write(this.createLogEntry('debug', message, metadata));
        }
    }
    info(message, metadata) {
        this.write(this.createLogEntry('info', message, metadata));
    }
    warn(message, metadata) {
        this.write(this.createLogEntry('warn', message, metadata));
    }
    error(message, metadata) {
        this.write(this.createLogEntry('error', message, metadata));
    }
    log(level, message, metadata) {
        if (level === 'debug' && !this.debug) {
            return;
        }
        this.write(this.createLogEntry(level, message, metadata));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map