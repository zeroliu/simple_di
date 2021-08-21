import { Container } from './container';
import { Inject } from './inject';
import { Injectable } from './injectable';
import { InjectorToken } from './provider';

describe('Container test', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe('inject()', () => {
    it('throws when provider type is not found', () => {
      expect(() => container.inject(class NotExist {})).toThrowError(
        'No provider for type NotExist',
      );
    });

    it('returns the value provided by value provider', () => {
      const value = {};
      const token = new InjectorToken('token');
      container.addProvider({
        provide: token,
        useValue: value,
      });
      expect(container.inject(token)).toBe(value);
    });

    it('returns the generated value by factory provider', () => {
      const value = {};
      const mockFactory = jest.fn().mockReturnValue(value);
      const token = new InjectorToken('token');
      container.addProvider({
        provide: token,
        useFactory: mockFactory,
      });
      const resolved = container.inject(token);
      expect(resolved).toBe(value);
      expect(mockFactory).toHaveBeenCalledWith();
      const resolved2 = container.inject(token);
      expect(resolved2).toBe(value);
      expect(mockFactory).toHaveBeenCalledWith();
      expect(mockFactory.mock.calls.length).toBe(2);
    });

    it('returns the instance by class provider', () => {
      class MockClass {}
      container.addProvider({
        provide: MockClass,
        useClass: MockClass,
      });
      expect(container.inject(MockClass) instanceof MockClass).toBe(true);
    });

    it('resolves top level class dependency', () => {
      @Injectable()
      class MockChild {}

      @Injectable()
      class MockParent {
        constructor(readonly child: MockChild) {}
      }

      container.addProvider({
        provide: MockChild,
        useClass: MockChild,
      });
      container.addProvider({
        provide: MockParent,
        useClass: MockParent,
      });
      const parent = container.inject(MockParent);
      expect(parent instanceof MockParent).toBe(true);
      expect(parent.child instanceof MockChild).toBe(true);
    });

    it('resolves top level inject token', () => {
      const token = new InjectorToken('token');

      @Injectable()
      class MockClass {
        constructor(@Inject(token) readonly injectValue: string) {}
      }

      container.addProvider({
        provide: token,
        useValue: 'test',
      });
      container.addProvider({
        provide: MockClass,
        useClass: MockClass,
      });

      const instance = container.inject(MockClass);
      expect(instance instanceof MockClass).toBe(true);
      expect(instance.injectValue).toBe('test');
    });
  });
});
