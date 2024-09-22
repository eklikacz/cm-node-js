import mongoose, { Document, Schema } from 'mongoose';
import { CountOptions } from 'mongodb';
import { InfrastructureError } from '@common/domain/error';
import ObjectId = mongoose.Schema.Types.ObjectId;
import { SessionStatic } from '@common/infrastructure/mongoDb/session.static';


export abstract class AbstractRepository<IEntity extends Document> {
  protected readonly collection: mongoose.Model<IEntity>;

  protected constructor (
    protected readonly modelName: string,
    protected readonly schema: Schema,
  ) {
    this.collection = mongoose.model<IEntity>(this.modelName, this.schema);
  }

  public get model () {
    return this.collection;
  }

  public getSession (): mongoose.ClientSession {
    return SessionStatic.getSession();
  }

  public findAll (
    filter: mongoose.RootFilterQuery<IEntity>,
    options?: mongoose.QueryOptions<IEntity>,
  ): Promise<IEntity[]> {
    return this.collection.find(filter, undefined, { ...options, session: this.getSession() }).exec();
  }

  public count (
    filter: mongoose.RootFilterQuery<IEntity>,
    options?: (CountOptions & mongoose.MongooseBaseQueryOptions<IEntity>) | null,
  ): Promise<number> {
    return this.collection.countDocuments(filter, { ...options, session: this.getSession() }).exec();
  }

  public findOneById (id: string, options?: mongoose.QueryOptions<IEntity>) {
    return this.collection.findById(new ObjectId(id), undefined, { ...options, session: this.getSession() })
      .exec()
      .then(found => {
        if (!found) {
          throw new InfrastructureError(`Entity "${this.modelName}" with id "${id}" not found!`);
        }

        return found;
      });
  }

  public findOne<Field extends keyof IEntity>(
    field: Field,
    value: IEntity[Field],
    options?: mongoose.QueryOptions<IEntity>,
  ) {
    // @ts-ignore Typing problem related to abstract class
    return this.collection.findOne({ [field]: value }, undefined, { ...options, session: this.getSession() })
      .exec()
      .then(found => {
        if (!found) {
          throw new InfrastructureError(`Entity "${this.modelName}" with ${String(field)} "${value}" not found!`);
        }

        return found;
      });
  }

  public create (entity: IEntity, options?: mongoose.CreateOptions) {
    return entity.save({ ...options, validateBeforeSave: true, session: this.getSession() });
  }

  public update (id: string, entity: Partial<IEntity>) {
    return this.collection.updateOne({ _id: new ObjectId(id) }, entity, {
      validateBeforeSave: true,
      session: this.getSession(),
    }).exec();
  }

  public delete (id: string) {
    return this.collection.deleteOne({ _id: new ObjectId(id) }, {
      validateBeforeSave: true,
      session: this.getSession(),
    }).exec();
  }
}