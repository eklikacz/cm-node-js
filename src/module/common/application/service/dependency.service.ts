import { CoreError } from '@common/domain/error';

type Constructor<T> = { new (...args: any[]): T };

export class DependencyService {
  private static _instance: DependencyService;
  private readonly singletons: Map<string, any> = new Map<string, any>();

  private constructor () {}

  public resolve<T> (classType: Constructor<T>, singleton: boolean = true): T {
    if (!classType) {
      throw new CoreError(`Cannot resolve module '${classType}'`);
    }
    const className = classType.name;

    if (singleton && this.singletons.has(className)) {
      return this.singletons.get(className);
    }

    const instance = this.createInstance(classType);

    if (singleton && instance) {
      this.singletons.set(className, instance);
    }

    return instance;
  }

  private createInstance<T> (classType: Constructor<T>): T {
    const constructorParams = Reflect.getMetadata('design:paramtypes', classType) || [];
    const dependencies = constructorParams.map((param: any) => this.resolve(param));

    return new classType(...dependencies);
  }

  public static instance (): DependencyService {
    if (!DependencyService._instance) {
      DependencyService._instance = new DependencyService();
    }

    return DependencyService._instance;
  }
}
