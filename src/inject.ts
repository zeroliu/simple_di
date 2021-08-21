import 'reflect-metadata';
import { Token } from './provider';

const INJECT_METADATA_KEY = Symbol('INJECT_KEY');

function propertyIndexName(index: number) {
  return `index-${index}`;
}

export function Inject(token: Token<unknown>): ParameterDecorator {
  return (target, propertyKey, paramIndex) => {
    Reflect.defineMetadata(
      INJECT_METADATA_KEY,
      token,
      target,
      propertyIndexName(paramIndex),
    );
    return target;
  };
}

export function getInjectionToken(
  target: Token<unknown>,
  index: number,
): Token<unknown> | undefined {
  return Reflect.getMetadata(
    INJECT_METADATA_KEY,
    target,
    propertyIndexName(index),
  );
}
