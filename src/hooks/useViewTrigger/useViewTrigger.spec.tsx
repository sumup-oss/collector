import React from 'react';
import { render } from '@testing-library/react';

import useViewTrigger from './useViewTrigger';

import TrackingRoot from '../../components/TrackingRoot';

const Component = ({ id }: { id: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useViewTrigger({ root: null, ref: ref.current, component: 'dummy', id });

  return <div ref={ref}>component</div>;
};

describe('useViewTrigger', () => {
  describe('when element is fully visible', () => {
    it('should dispatch a view event', () => {
      const dispatch = jest.fn();
      render(
        <TrackingRoot name="app" onDispatch={dispatch}>
          <Component id="123" />
        </TrackingRoot>
      );
    });
  });
});
