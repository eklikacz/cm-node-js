import { CoreError } from '@common/domain/error';
import { RestError } from '@common/domain/error/rest';
import { EnvService } from '@common/application/service/env.service';
import { Request, Response } from 'express';

export type Level = 'log' | 'debug' | 'info' | 'warn' | 'error' | 'request';

export interface LoggerParams {
  level: Level,
  message: string,
  success?: boolean,
  trace?: string,
  status?: number,
  codeStatus?: string,
  code?: string,
  customParameters?: Record<string, any>,
  config: any,
}

export class Logger {
  private static _instance: Logger = new Logger({});
  private isDebug = EnvService.instance().getEnv('IS_DEBUG', false);

  public constructor (private readonly config: any = {}) {
    this.config.isDebug = EnvService.getEnv('IS_DEBUG', false);
  }

  public log (message: string, customParameters: Record<string, any> = {}): void {
    this.call({
      level: 'log',
      message,
      success: true,
      customParameters,
      config: this.config,
    });
  }

  public request (req: Request, res: Response, customParameters: Record<string, any> = {}): void {
    this.call({
      level: 'request',
      message: req.method + ' ' + req.path + ' [' + res.statusCode + ']',
      success: res.statusCode >= 200 && res.statusCode < 300,
      customParameters: {
        ...customParameters,
        protocol: req.protocol,
        hostname: req.hostname,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
      },
      config: this.config,
    });
  }

  public debug (message: string, customParameters: Record<string, any> = {}): void {
    if (!this.isDebug) {
      return;
    }

    this.call({
      level: 'debug',
      message,
      success: true,
      customParameters,
      config: this.config,
    });
  }

  public info (message: string, customParameters: Record<string, any> = {}): void {
    this.call({
      level: 'info',
      message,
      success: true,
      customParameters,
      config: this.config,
    });
  }

  public warn (message: string, customParameters: Record<string, any> = {}): void {
    this.call({
      level: 'warn',
      message,
      success: false,
      customParameters,
      config: this.config,
    });
  }

  public error (messageOrError: Error | string, customParameters: Record<string, any> = {}): void {
    const params: LoggerParams = {
      level: 'error',
      success: false,
      config: this.config,
      message: '',
    };
    let errors: any = [];

    if (messageOrError instanceof RestError) {
      params.message = messageOrError.name + ' - ' + messageOrError.message;
      params.trace = messageOrError?.stack ?? '';
      params.code = messageOrError?.code ?? '';
      params.status = messageOrError.status;
      params.codeStatus = messageOrError.code.toUpperCase();
      errors = (messageOrError.errors ?? []).map((err: any) => ({
        message: err.message,
        code: err.code,
      }));
    } else if (messageOrError instanceof CoreError) {
      params.message = messageOrError.name + ' - ' + messageOrError.message;
      params.trace = messageOrError?.stack ?? '';
      params.code = messageOrError?.code ?? '';
    } else if (messageOrError instanceof Error) {
      const coreError = CoreError.createCoreError(messageOrError);

      params.message = coreError.name + ' - ' + coreError.message;
      params.trace = coreError?.stack ?? '';
      params.code = coreError?.code ?? '';
    } else {
      params.message = messageOrError;
    }

    this.call({
      ...params,
      customParameters: { ...customParameters, errors },
    });
  }

  public clone (config: any = {}): Logger {
    return new Logger(Object.assign({}, this.config, config));
  }

  protected call (params: LoggerParams): void {
    const date = new Date();
    process.stdout.write(`[${date.toISOString()}] ${JSON.stringify(params)}\n`);
  }

  public static instance (): Logger {
    return Logger._instance;
  }
}
