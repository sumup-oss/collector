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
import { render, act } from '@testing-library/react';

import { TrackingRoot } from '../../components/TrackingRoot';
import { Events } from '../../types';

import { usePageActiveTrigger } from './usePageActiveTrigger';

const Dummy = () => {
  usePageActiveTrigger();

  return <div>Dummy component</div>;
};

describe('usePageActiveTrigger', () => {
  describe('when the page becomes active', () => {
    it('should provide dispatch the pageView event', () => {
      const dispatch = jest.fn();
      const app = 'test-app-hook';

      const expected = {
        app,
        event: Events.pageReactivated,
        elementTree: [],
        timestamp: expect.any(Number),
      };

      render(
        <TrackingRoot name={app} onDispatch={dispatch}>
          <Dummy />
        </TrackingRoot>,
      );

      act(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          value: true,
        });

        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(dispatch).not.toHaveBeenCalledWith(expected);

      act(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          value: false,
        });

        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
