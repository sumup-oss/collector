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
import { render, fireEvent, waitForElement } from '@testing-library/react';

import TrackingRoot from '../../TrackingRoot';
import TrackingView from '../TrackingView';

import useClickTracker from '../../../hooks/useClickTracker';

import ACTIONS from '../../../constants/actions';
import COMPONENTS from '../../../constants/components';

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

describe('View', () => {
  it('should attach the view property when dispatching an event', () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test-view-spec';
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
        <TrackingView name={view}>
          <DispatchButton />
        </TrackingView>
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('should attach the view property when loaded using lazy', async () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test-view-spec';
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

    const TrackingLazy = React.lazy(() => import('./LazyTrackingView'));
    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <React.Suspense fallback>
          <TrackingLazy name={view}>
            <DispatchButton />
          </TrackingLazy>
        </React.Suspense>
      </TrackingRoot>
    );
    const element = await waitForElement(() => getByTestId(btn));
    fireEvent.click(element);
    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});
