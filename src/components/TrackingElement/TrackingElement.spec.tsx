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
import TrackingView from '../TrackingView';
import useClickTrigger from '../../hooks/useClickTrigger';

import TrackingElement from './TrackingElement';

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

describe('Element', () => {
  it('should attach the element property when dispatching an event', () => {
    const dispatch = jest.fn();
    const app = '';
    const view = 'test';
    const element = 'test-element-spec';
    const btn = 'dispatch-btn';
    const component = 'button';

    const expected = {
      app,
      view,
      elementTree: [element],
      event: Events.click,
      component,
      label: undefined,
      timestamp: expect.any(Number)
    };

    const { getByTestId } = render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <TrackingView name={view}>
          <TrackingElement name={element}>
            <DispatchButton />
          </TrackingElement>
        </TrackingView>
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btn));

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
      timestamp: expect.any(Number)
    };

    const expectedForElementB = {
      ...expectedForElementA,
      elementTree: [elementA, elementB]
    };

    const expectedForElementC = {
      ...expectedForElementA,
      elementTree: [elementA, elementC]
    };

    const { getByTestId } = render(
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
      </TrackingRoot>
    );

    fireEvent.click(getByTestId(btnA));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementA);

    fireEvent.click(getByTestId(btnB));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementB);

    fireEvent.click(getByTestId(btnC));

    expect(dispatch).toHaveBeenCalledWith(expectedForElementC);
  });
});
