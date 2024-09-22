export function Injectable () {
  return function <T extends { new (...args: any[]): any}> (constructor: T) {
    Reflect.defineMetadata(
      'design:paramtypes',
      Reflect.getMetadata('design:paramtypes', constructor),
      constructor,
    );
  };
}
