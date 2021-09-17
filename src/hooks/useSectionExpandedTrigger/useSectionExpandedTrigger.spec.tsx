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
import TrackingRoot from '../../components/TrackingRoot';

import useSectionExpandedTrigger from './useSectionExpandedTrigger';

const DispatchButton = () => {
  const dispatch = useSectionExpandedTrigger();

  return (
    <button
      data-testid="section"
      onClick={() =>
        dispatch({
          component: 'section',
        })
      }
    >
      Dispatch button
    </button>
  );
};

describe('useSectionExpandedTrigger', () => {
  it('should provide a dispatch function that contains the section-expanded event', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';
    const btn = 'section';
    const component = 'section';

    const expected = {
      app,
      view: undefined,
      elementTree: [],
      event: Events.sectionExpanded,
      component,
      id: undefined,
      timestamp: expect.any(Number),
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <DispatchButton />
      </TrackingRoot>,
    );

    fireEvent.click(screen.getByTestId(btn));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});
