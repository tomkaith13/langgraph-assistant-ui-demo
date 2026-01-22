import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}

export function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
export { customRender as render };

// Mock localStorage for tests
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Mock global localStorage
global.localStorage = mockLocalStorage as Storage;
