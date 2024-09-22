import { CqrsService, EmptyObject } from './';
import { Injectable } from '@common/application/decorator';
import mongoose from 'mongoose';

export interface ICommand extends EmptyObject {
}

@Injectable()
export class CommandBusService {
  public constructor (
    private readonly cqrsService: CqrsService,
  ) {
  }

  public async execute<C extends ICommand>(command: C, session: mongoose.ClientSession): Promise<void> {
    const name = command.constructor.name;
    const handle = this.cqrsService.getCommandHandler<C>(name);

    await handle.setSession(session).execute(command);
  }
}

export class AbstractCommandHandler implements ICommand {
  protected session!: mongoose.ClientSession;

  public setSession (session: mongoose.ClientSession) {
    this.session = session;

    return this;
  }
}
