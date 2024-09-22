import { Logger, Level, LoggerParams } from '@common/application/service';

export class MockedLoggerService extends Logger {
  private logs: { [key in Level]: LoggerParams[] } = {
    debug: [],
    warn: [],
    info: [],
    request: [],
    log: [],
    error: [],
  };

  public getLogs (level: Level): LoggerParams[] {
    return this.logs[level];
  }

  public clean (): void {
    this.logs = {
      debug: [],
      warn: [],
      info: [],
      request: [],
      log: [],
      error: [],
    };
  }

  protected call (params: LoggerParams): void {
    this.logs[params.level].push(params);
  }
}
