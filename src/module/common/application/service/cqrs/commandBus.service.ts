import { CqrsService, EmptyObject } from './';
import { Injectable } from '@common/application/decorator';

export interface ICommand extends EmptyObject {}

@Injectable()
export class CommandBusService {
  public constructor (
        private readonly cqrsService: CqrsService,
  ) {}

  public async execute <C extends ICommand> (command: C): Promise<void> {
    const name = command.constructor.name;
    const handle = this.cqrsService.getCommandHandler<C>(name);

    await handle.execute(command);
  }
}
