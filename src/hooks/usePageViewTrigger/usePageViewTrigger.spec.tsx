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
import { render, fireEvent, act } from '@testing-library/react';

import TrackingRoot from '../../components/TrackingRoot';
import usePageViewTrigger from './usePageViewTrigger';
import { Events } from '../../types';

const DispatchButton = () => {
  const dispatch = usePageViewTrigger({ visibilityChange: true });

  return (
    <button data-testid="dispatch-btn" onClick={() => dispatch()}>
      Dispatch button
    </button>
  );
};

describe('usePageViewTrigger', () => {
  it('should provide a dispatch function that contains the pageView event', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';
    const btn = 'dispatch-btn';

    const expected = {
      app,
      event: Events.pageView,
      timestamp: expect.any(Number)
    };

    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <DispatchButton />
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
  describe('when the document becomes inactive than active again', () => {
    it('should provide a dispatch function that contains the pageView event', () => {
      const dispatch = jest.fn();
      const app = 'test-app-hook';

      const expected = {
        app,
        event: Events.pageView,
        timestamp: expect.any(Number)
      };

      render(
        <TrackingRoot name={app} onDispatch={dispatch}>
          <DispatchButton />
        </TrackingRoot>
      );

      act(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          value: true
        });

        document.dispatchEvent(new Event('visibilitychange'));
      });

      act(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          value: false
        });

        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
