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
import { render, fireEvent, screen } from '@testing-library/react';

import { Events } from '../../types';
import { TrackingRoot } from '../TrackingRoot';
import { TrackingView } from '../TrackingView';
import { useClickTrigger } from '../../hooks/useClickTrigger';

import { TrackingElement } from './TrackingElement';

interface DispatchButtonProps {
  testId?: string;
}

const DispatchButton = ({ testId = 'dispatch-btn' }: DispatchButtonProps) => {
  const dispatch = useClickTrigger();

  return (
    <button
      data-testid={testId}
      onClick={() =>
        dispatch({
          component: 'button',
        })
      }
    >
      Dispatch button
    </button>
  );
};

describe('Element', () => {
  it('should append the name to the elementTree when dispatching an event', () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test';
    const name = 'test-element';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view,
      elementTree: [name],
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number),
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name={view}>
          <TrackingElement name={name}>
            <DispatchButton />
          </TrackingElement>
        </TrackingView>
      </TrackingRoot>,
    );

    fireEvent.click(screen.getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('should append the name and label to the elementTree when dispatching an event', () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test';
    const name = 'test-element';
    const label = 'test-label';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view,
      elementTree: ['test-element|test-label'],
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number),
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name={view}>
          <TrackingElement name={name} label={label}>
            <DispatchButton />
          </TrackingElement>
        </TrackingView>
      </TrackingRoot>,
    );

    fireEvent.click(screen.getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});

describe('Nested Elements', () => {
  it('should properly nest the elements in the elementTree per "branch"', () => {
    const dispatch = jest.fn();
    const app = 'test-app-spec';
    const view = 'test-view-spec';
    const component = 'button';

    const elementA = 'test-element-spec A';
    const elementB = 'test-element-spec B';
    const elementC = 'test-element-spec C';

    const btnA = 'dispatch-btn-a';
    const btnB = 'dispatch-btn-b';
    const btnC = 'dispatch-btn-c';

    const expectedForElementA = {
      app,
      view,
      elementTree: [elementA],
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number),
    };

    const expectedForElementB = {
      ...expectedForElementA,
      elementTree: [elementA, elementB],
    };

    const expectedForElementC = {
      ...expectedForElementA,
      elementTree: [elementA, elementC],
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name={view}>
          <TrackingElement name={elementA}>
            <DispatchButton testId={btnA} />
            <TrackingElement name={elementB}>
              <DispatchButton testId={btnB} />
            </TrackingElement>

            <TrackingElement name={elementC}>
              <DispatchButton testId={btnC} />
            </TrackingElement>
          </TrackingElement>
        </TrackingView>
      </TrackingRoot>,
    );

    fireEvent.click(screen.getByTestId(btnA));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementA);

    fireEvent.click(screen.getByTestId(btnB));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementB);

    fireEvent.click(screen.getByTestId(btnC));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementC);
  });
});
