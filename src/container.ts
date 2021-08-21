import { getInjectionToken } from './inject';
import {
  ClassProvider,
  getTokenName,
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
  Provider,
  Token,
} from './provider';
import { Type } from './type';

const REFLECT_PARAMS = 'design:paramtypes';

export class Container {
  private providers = new Map<Token<any>, Provider<any>>();

  addProvider<T>(provider: Provider<T>) {
    this.providers.set(provider.provide, provider);
  }

  inject<T>(token: Token<T>): T {
    let provider = this.providers.get(token);
    if (provider === undefined) {
      throw new Error(`No provider for type ${getTokenName(token)}`);
    }
    return this.injectWithProvider(token, provider);
  }

  private injectWithProvider<T>(token: Token<T>, provider: Provider<T>): T {
    if (isValueProvider(provider)) {
      return provider.useValue;
    }
    if (isFactoryProvider(provider)) {
      return provider.useFactory();
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider);
    }
    throw new Error(`Invalid provider for type ${getTokenName(token)}`);
  }

  private injectClass<T>(classProvider: ClassProvider<T>): T {
    const cls = classProvider.useClass;
    const params = this.getInjectedParams(cls);
    return Reflect.construct(cls, params);
  }

  private getInjectedParams<T>(cls: Type<T>) {
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, cls) as
      | Array<Token<unknown>>
      | undefined;
    if (argTypes === undefined) {
      return [];
    }
    return argTypes.map((argType, index) => {
      if (argType === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected for target ${cls.name} with parameter at index ${index}.`,
        );
      }
      const overrideToken = getInjectionToken(cls, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      const provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    });
  }
}
