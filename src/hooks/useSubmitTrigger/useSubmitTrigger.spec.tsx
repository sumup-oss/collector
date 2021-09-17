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

import useSubmitTrigger from './useSubmitTrigger';

const DispatchForm = () => {
  const dispatch = useSubmitTrigger();

  return (
    <form
      data-testid="dispatch-form"
      onSubmit={(e) => {
        e.preventDefault();

        dispatch({
          component: 'form',
        });
      }}
    >
      Dispatch button
    </form>
  );
};

describe('useSubmitTrigger', () => {
  it('should provide a dispatch function that contains the submit event', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';
    const form = 'dispatch-form';
    const component = 'form';

    const expected = {
      app,
      view: undefined,
      elementTree: [],
      event: Events.submit,
      component,
      id: undefined,
      timestamp: expect.any(Number),
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <DispatchForm />
      </TrackingRoot>,
    );

    fireEvent.submit(screen.getByTestId(form));

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});
