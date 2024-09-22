import { CqrsService, EmptyObject } from './';
import { Injectable } from '@common/application/decorator';
import mongoose from 'mongoose';

export interface IQuery extends EmptyObject {
}

@Injectable()
export class QueryBusService {
  public constructor (
    private readonly cqrsService: CqrsService,
  ) {
  }

  public async execute<Q extends IQuery, R>(query: Q, session: mongoose.ClientSession): Promise<R> {
    const name = query.constructor.name;
    const handle = this.cqrsService.getQueryHandler<Q, R>(name);

    return handle.setSession(session).execute(query);
  }
}

export class AbstractQueryHandler implements IQuery {
  protected session!: mongoose.ClientSession;

  public setSession (session: mongoose.ClientSession) {
    this.session = session;

    return this;
  }
}
