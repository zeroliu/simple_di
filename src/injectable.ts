import 'reflect-metadata';

const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_KEY');

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    return target;
  };
}
