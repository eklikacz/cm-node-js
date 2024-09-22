import { ApplicationError } from '@common/domain/error';
import { ICommand } from '@common/application/service/cqrs/commandBus.service';
import { IQuery } from '@common/application/service/cqrs/queryBus.service';
import { Injectable } from '@common/application/decorator';
import mongoose from 'mongoose';

export type EmptyObject = { [key: string]: any };

export interface IQueryHandler<Q extends EmptyObject, R> {
  execute(query: Q): Promise<R>,

  setSession(session: mongoose.ClientSession): this,
}

export interface ICommandHandler<C extends EmptyObject> {
  execute(query: C): Promise<void>,

  setSession(session: mongoose.ClientSession): this,
}

@Injectable()
export class CqrsService {
  private queryHandler: { [name in string]: IQueryHandler<EmptyObject, any> } = {};
  private commandHandler: { [name in string]: ICommandHandler<EmptyObject> } = {};

  public registerCommandHandler<C extends ICommand>(commandClass: C, commandHandler: ICommandHandler<EmptyObject>) {
    const name = commandClass.name;

    if (this.commandHandler[name] !== undefined) {
      throw new ApplicationError(`CommandHandler already registered: ${name}`);
    }

    this.commandHandler[name] = commandHandler;

    return this;
  }

  public registerQueryHandler<Q extends IQuery, R>(queryClass: Q, queryHandler: IQueryHandler<EmptyObject, R>) {
    const name = queryClass.name;

    if (this.queryHandler[name] !== undefined) {
      throw new ApplicationError(`QueryHandler already registered: ${name}`);
    }

    this.queryHandler[name] = queryHandler;

    return this;
  }

  public getQueryHandler<Q extends EmptyObject, R>(name: string): IQueryHandler<Q, R> {
    if (!this.queryHandler[name]) {
      throw new ApplicationError(`QueryHandler not exist: ${name}`);
    }

    return this.queryHandler[name];
  }

  public getCommandHandler<Q extends EmptyObject>(name: string): ICommandHandler<Q> {
    if (!this.commandHandler[name]) {
      throw new ApplicationError(`CommandHandler not exist: ${name}`);
    }

    return this.commandHandler[name];
  }
}
