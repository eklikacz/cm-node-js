import { Injectable } from '@common/application/decorator';
import { ContextRunner } from 'express-validator';
import { ApplicationError } from '@common/domain/error';
import * as console from 'node:console';

@Injectable()
export class RoutingValidatorService {
  private readonly routingMap: Map<string, ContextRunner[]> = new Map();

  public register (method: string, path: string, validators: ContextRunner[]): this {
    const name = path.toUpperCase() + ':' + method.toUpperCase();

    if (this.routingMap.has(name)) {
      throw new ApplicationError('Routing validator service already registered');
    }

    this.routingMap.set(name, validators);

    return this;
  }

  public getValidators (method: string, path: string): ContextRunner[] {
    const name = path.toUpperCase() + ':' + method.toUpperCase();

    if (this.routingMap.has(name)) {
      return this.routingMap.get(name) ?? [];
    }

    return [];
  }
}
