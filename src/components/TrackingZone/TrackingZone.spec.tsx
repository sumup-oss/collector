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

import { Events } from '../../types';
import TrackingRoot from '../TrackingRoot';
import TrackingZone from './TrackingZone';
import TrackingView from '../TrackingView';

import useClickTrigger from '../../hooks/useClickTrigger';

interface DispatchButton {
  testId?: string;
}

const DispatchButton = ({ testId = 'dispatch-btn' }: DispatchButton) => {
  const dispatch = useClickTrigger();

  return (
    <button
      data-testid={testId}
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

describe('Zone', () => {
  it('should attach the zone property when dispatching an event', () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test';
    const zone = 'test-zone-spec';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view,
      zone,
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number)
    };

    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name="test">
          <TrackingZone name={zone}>
            <DispatchButton />
          </TrackingZone>
        </TrackingView>
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});

describe('Nested Zones', () => {
  it('Button located within nested zones A & B dispatching their immediate parent zone name', () => {
    const dispatch = jest.fn();
    const app = 'test-app-spec';
    const view = 'test-view-spec';
    const component = 'button';
    const zoneA = 'test-zone-spec A';
    const zoneB = 'test-zone-spec B';
    const btnA = 'dispatch-btn-a';
    const btnB = 'dispatch-btn-b';

    const expectedForZoneB = {
      app,
      view,
      zone: zoneB,
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number)
    };

    const expectedForZoneA = {
      app,
      view,
      zone: zoneA,
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number)
    };

    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name={view}>
          <TrackingZone name={zoneA}>
            <DispatchButton testId={btnA} />
            <TrackingZone name={zoneB}>
              <DispatchButton testId={btnB} />
            </TrackingZone>
          </TrackingZone>
        </TrackingView>
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btnA));

    expect(dispatch).toHaveBeenCalledWith(expectedForZoneA);

    fireEvent.click(getByTestId(btnB));

    expect(dispatch).toHaveBeenCalledWith(expectedForZoneB);
  });
});
