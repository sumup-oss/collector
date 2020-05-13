import * as React from 'react';

import TrackingContext from '../../components/TrackingContext';
import ACTIONS from '../../constants/actions';

interface Args {
  root: HTMLElement | null;
  ref: HTMLElement | null;
  component: string;
  id: string;
}

const useViewTrigger = ({ root, ref, component, id }: Args) => {
  const { dispatch, app, view, zone } = React.useContext(TrackingContext);
  const observer = React.useRef<IntersectionObserver>(
    new IntersectionObserver(
      entries => {
        const { isIntersecting } = entries[0];

        if (isIntersecting) {
          dispatch &&
            dispatch({
              app,
              view,
              zone,
              action: ACTIONS.view,
              component,
              id,
              timestamp: Date.now()
            });
        }
      },
      { threshold: 1.0 }
    )
  );

  React.useEffect(() => {
    if (ref) {
      observer.current.observe(ref);
    }

    return () => {
      if (observer.current && ref) {
        observer.current.unobserve(ref);
      }
    };
  }, [ref, root, component, id]);
};

export default useViewTrigger;
