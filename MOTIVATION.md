# Motivation

The larger a web applications grows, the harder it is to provide predictable and traceable tracking structures. Consider our usual analytics event dispatching:

```jsx
import React, { useContext } from 'react';
import { TrackingContext } from 'your-tracking';

function Button({ onClick, label, category, value, dispatch, children }) {
  let handler = onClick;

  if (dispatch) {
    handler = e => {
      dispatch({ label, category, value });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}

function AccountBalance() {
  return (
    <Button
      type="submit"
      label="show-value"
      category="balance"
      dispatch={dispatch}
    >
      Click me
    </Button>
  );
}

function AccountPage() {
  return (
    ...,
    <Balance />
  );
}

function Balance() {
  return (
   ...,
   <ShowBalance />
  );
}

function App() {
  return (
    <TrackingContext.Provider
      value={{
        dispatch: e => {
          window.dataLayer.push(e);
        }
      }}
    >
      <AccountPage />
    </TrackingContext.Provider>
  );
}

```

Now, what happens if we need to define the event `category` somewhere else in the tree? For this small example it might not sound like much:

```jsx
function AccountBalance({ category }) {
  const { dispatch } = useContext(TrackingContext);

  return (
    <Button
      type="submit"
      label="show-value"
      category={category}
      dispatch={dispatch}
    >
      Click me
    </Button>
  );
}
```

But over time this can tightly couple our component implementation with the tracking usage. Ideally the `AccountBalance` component shouldn't have to worry about this sort of domain.

What about leveraging our already existing `TrackingContext`?

```jsx
function AccountBalance() {
  const { dispatch, category } = useContext(TrackingContext);

  return (
    <Button
      type="submit"
      label="show-value"
      category={category}
      dispatch={dispatch}
    >
      Click me
    </Button>
  );
}
```

But having a context usage also implies that you eventually need to set the value somewhere in the tree:

```jsx
function AccountBalance() {
  const { dispatch, category } = useContext(TrackingContext);

  return (
    <Button
      type="submit"
      label="show-value"
      category={category}
      dispatch={dispatch}
    >
      Click me
    </Button>
  );
}

function Balance() {
  const { dispatch, setValue } = useContext(TrackingContext);
  useEffect(() => {
    setValue({ category: 'account-balance' });
  }, []);

  return (
   ...,
   <ShowBalance />
  );
}

function App() {
  const [trackingData, setTrackingData] = useState({});
  return (
    <TrackingContext.Provider
      value={{
        ...trackingData,
        dispatch: e => {
          window.dataLayer.push(e);
        },
        setValue: value => setTrackingData({ ...trackingData, ...value })
      }}
    >
      <AccountPage />
    </TrackingContext.Provider>
  );
}
```

But again, over time this can tightly couple our component implementation with the event tracking usage, and the more fields you need to overwrite, the harder it is to reason about the current state of the context. That's where Collector can help you!

Collector was built to track user-interactions with high granularity. Using an agnostic event schema you can serve different tracking purposes with it. Consider the same example using Collector:

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  TrackingZone,
  useClickTrigger
} from '@sumup/collector';

function Button({ onClick, 'tracking-label': trackingId, children }) {
  const dispatch = useClickTrigger();
  let handler = onClick;

  if (trackingId) {
    handler = (e) => {
      dispatch({ label: trackingId, component: 'button' });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}

function AccountBalance() {
  return (
    <Button type="submit" tracking-label="show-balance">
      Click me
    </Button>
  );
}

function AccountPage() {
  return (
    <TrackingView name="account">
      ...,
      <Balance />
    </TrackingView>
  );
}

function Balance() {
  return (
    <TrackingZone name="balance">
      ...,
      <ShowBalance />
    </TrackingZone>
  );
}

function toAnalyticsEvent({ view, zone, label, action }) {
  return {
    category: `${view}-${zone}`,
    label: label,
    action
  };
}

function App() {
  return (
    <TrackingRoot
      name="my-app"
      onDispatch={(event) => {
        window.dataLayer.push(toAnalyticsEvent(event));
      }}
    >
      <AccountPage />
    </TrackingRoot>
  );
}
```

For more information about the event schema and component structure, please refer to the [Event Schema](https://github.com/sumup/collector/#event-schema) and [Usage](https://github.com/sumup/collector/#usage) sections.
