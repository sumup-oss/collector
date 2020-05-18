/**
 * Copyright 2019, SumUp Ltd.
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

import { EVENTS } from '../../types';
import TrackingRoot from '../TrackingRoot';
import useClickTrigger from '../../hooks/useClickTrigger';

const DispatchButton = () => {
  const dispatch = useClickTrigger();

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

describe('Root', () => {
  it('should attach the app property and use the provided dispatch function', () => {
    const dispatch = jest.fn();
    const app = 'test-app-spec';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view: undefined,
      zone: undefined,
      event: EVENTS.click,
      component,
      label: undefined,
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
