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

import TrackingRoot from '../TrackingRoot';
import TrackingBase from './TrackingBase';

import useClickTracker from '../../hooks/useClickTracker';

import ACTIONS from '../../constants/actions';
import COMPONENTS from '../../constants/components';

const DispatchButton = () => {
  const dispatch = useClickTracker();

  return (
    <button
      data-testid="dispatch-btn"
      onClick={() =>
        dispatch({
          component: COMPONENTS.button
        })
      }
    >
      Dispatch button
    </button>
  );
};

describe('Base', () => {
  it('should attach the provided [type] property when dispatching an event', () => {
    const dispatch = jest.fn();
    const type = 'view';
    const app = '';
    const view = 'test-view-base-spec';
    const zone = '';
    const btn = 'dispatch-btn';

    const expected = {
      app,
      view,
      zone,
      action: ACTIONS.click,
      component: COMPONENTS.button,
      id: undefined,
      timestamp: expect.any(Number)
    };

    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingBase name={view} type={type}>
          <DispatchButton />
        </TrackingBase>
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});
