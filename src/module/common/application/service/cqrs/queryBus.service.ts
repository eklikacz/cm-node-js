import { CqrsService, EmptyObject } from './';
import { Injectable } from '@common/application/decorator';

export interface IQuery extends EmptyObject {}

@Injectable()
export class QueryBusService {
  public constructor (
        private readonly cqrsService: CqrsService,
  ) {}

  public async execute <Q extends IQuery, R> (query: Q): Promise<R> {
    const name = query.constructor.name;
    const handle = this.cqrsService.getQueryHandler<Q, R>(name);

    return handle.execute(query);
  }
}
