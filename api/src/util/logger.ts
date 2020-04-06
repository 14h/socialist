import * as bunyan from 'bunyan';
import { LoggerOptions } from 'bunyan';

const logLevel = process.env.level || 'debug';

export const logger = bunyan.createLogger({
    name: 'coeus',
    level: logLevel as bunyan.LogLevel,
    serializers: bunyan.stdSerializers,
});

export const createLogger = (
    name: string,
    params?: Partial<LoggerOptions>,
) =>
    bunyan.createLogger({
        name,
        level: logLevel as bunyan.LogLevel,
        serializers: bunyan.stdSerializers,
        ...params,
    });
