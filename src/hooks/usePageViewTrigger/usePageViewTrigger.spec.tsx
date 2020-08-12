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
import { render, fireEvent } from '@testing-library/react';

import TrackingRoot from '../../components/TrackingRoot';
import { Events } from '../../types';

import usePageViewTrigger from './usePageViewTrigger';

const DispatchButton = () => {
  const dispatch = usePageViewTrigger();

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
      elementTree: [],
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
});
