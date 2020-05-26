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

import { Events } from '../../types';
import TrackingRoot from '../../components/TrackingRoot';
import useBaseTrigger from './useBaseTrigger';

const DispatchButton = () => {
  const dispatch = useBaseTrigger(Events.click);

  return (
    <button
      data-testid="dispatch-btn"
      onClick={() =>
        dispatch({
          component: 'button'
        })
      }
    >
      Dispatch button
    </button>
  );
};

describe('useBaseTrigger', () => {
  it('should provide a dispatch function that accepts a label and a component, and attaches the app/view/zone/event/timestamp to the dispatched event', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view: undefined,
      zone: undefined,
      event: Events.click,
      component,
      id: undefined,
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
