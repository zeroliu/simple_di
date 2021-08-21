import {
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from './provider';

class MockClass {}

describe('providers test', () => {
  describe('isClassProvider', () => {
    it('returns true for class provider', () => {
      expect(isClassProvider({ provide: MockClass, useClass: MockClass })).toBe(
        true,
      );
    });

    it('returns false for non class provider', () => {
      expect(
        isClassProvider({ provide: MockClass, useFactory: () => true }),
      ).toBe(false);

      expect(isClassProvider({ provide: MockClass, useValue: true })).toBe(
        false,
      );
    });
  });

  describe('isValueProvider', () => {
    it('returns true for value provider', () => {
      expect(isValueProvider({ provide: MockClass, useValue: true })).toBe(
        true,
      );
    });

    it('returns false for non value provider', () => {
      expect(
        isValueProvider({ provide: MockClass, useFactory: () => true }),
      ).toBe(false);

      expect(isValueProvider({ provide: MockClass, useClass: MockClass })).toBe(
        false,
      );
    });
  });

  describe('isFactoryProvider', () => {
    it('returns true for factory provider', () => {
      expect(
        isFactoryProvider({ provide: MockClass, useFactory: () => true }),
      ).toBe(true);
    });

    it('returns false for non factory provider', () => {
      expect(
        isFactoryProvider({ provide: MockClass, useClass: MockClass }),
      ).toBe(false);

      expect(isFactoryProvider({ provide: MockClass, useValue: true })).toBe(
        false,
      );
    });
  });
});
