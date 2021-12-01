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
import { render } from '@testing-library/react';

import { TrackingRoot } from '../../components/TrackingRoot';
import { Events } from '../../types';

import { usePageViewTrigger } from './usePageViewTrigger';

const DispatchPage = ({ mockDispatchData = {} }) => {
  const dispatchPageView = usePageViewTrigger();

  React.useEffect(() => {
    dispatchPageView(mockDispatchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Dispatch page</div>;
};

describe('usePageViewTrigger', () => {
  it('should provide a dispatch function that contains the pageView event', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';

    const expected = {
      app,
      event: Events.pageView,
      elementTree: [],
      timestamp: expect.any(Number),
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <DispatchPage />
      </TrackingRoot>,
    );

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('should provide a dispatch function that contains the pageView event with optional custom parameters', () => {
    const dispatch = jest.fn();
    const app = 'test-app-hook';
    const customParameters = {
      isConsentUpdate: true,
    };

    const expected = {
      app,
      event: Events.pageView,
      elementTree: [],
      timestamp: expect.any(Number),
      customParameters,
    };

    render(
      <TrackingRoot name={app} onDispatch={dispatch}>
        <DispatchPage mockDispatchData={{ customParameters }} />
      </TrackingRoot>,
    );

    expect(dispatch).toHaveBeenCalledWith(expected);
  });
});
