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

import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import usePrevious from './usePrevious';

describe('usePrevious', () => {
  it('should store the previous value', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = React.useState(0);
      return {
        count,
        setCount,
        prevCount: usePrevious(count)
      };
    });

    expect(result.current.prevCount).toBe(0);

    act(() => {
      result.current.setCount(1);
    });

    expect(result.current.prevCount).toBe(0);

    act(() => {
      result.current.setCount(2);
    });

    expect(result.current.prevCount).toBe(1);
  });
});
