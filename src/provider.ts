import { Type } from './type';

export class InjectorToken {
  constructor(readonly injectorIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectorToken;

interface BaseProvider<T> {
  provide: Token<T>;
}

export interface ClassProvider<T> extends BaseProvider<T> {
  useClass: Type<T>;
}

export interface ValueProvider<T> extends BaseProvider<T> {
  useValue: T;
}

export interface FactoryProvider<T> extends BaseProvider<T> {
  useFactory: () => T;
}

export type Provider<T> =
  | ClassProvider<T>
  | FactoryProvider<T>
  | ValueProvider<T>;

export function isClassProvider<T>(
  provider: Provider<T>,
): provider is ClassProvider<T> {
  return (provider as any).useClass !== undefined;
}

export function isFactoryProvider<T>(
  provider: Provider<T>,
): provider is FactoryProvider<T> {
  return (provider as any).useFactory !== undefined;
}

export function isValueProvider<T>(
  provider: Provider<T>,
): provider is ValueProvider<T> {
  return (provider as any).useValue !== undefined;
}

export function getTokenName<T>(token: Token<T>) {
  if (token instanceof InjectorToken) {
    return token.injectorIdentifier;
  }
  return token.name;
}
