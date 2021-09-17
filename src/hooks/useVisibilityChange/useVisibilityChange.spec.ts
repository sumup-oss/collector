/**
 * Copyright 2020, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { renderHook, act } from '@testing-library/react-hooks';

import { useVisibilityChange } from './useVisibilityChange';

describe('useVisibilityChange', () => {
  afterAll(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  it('should execute the provided callback every time visibility changes with the current visibility as prop', () => {
    const visibilityHandler = jest.fn();

    renderHook(() => useVisibilityChange(visibilityHandler));

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(visibilityHandler).toHaveBeenCalledWith(false);
  });
});
