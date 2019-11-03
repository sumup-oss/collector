[![License](https://img.shields.io/badge/license-Apache%202-lightgrey.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

<div align="center">

# Collector

Collector is a collection of React components that facilitates user-interaction tracking for complex interfaces with a predictable event structure.

</div>

##### Table of contents

- [TLDR](#tldr)
- [Motivation](#motivation)
- [Getting started](#getting-started)
- [Usage](#usage)

## TLDR

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  TrackingZone,
  useTracking,
  ACTIONS,
  COMPONENTS
} from '@sumup/collector';

function Button({ onClick, 'tracking-id': trackingId, children }) {
  const dispatch = useTracking();
  let handler = onClick;

  if (id) {
    handler = e => {
      dispatch({ id, component: COMPONENTS.button, action: ACTIONS.click });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}

function App() {
  return (
    <TrackingRoot
      name="my-app"
      onDispatch={event => {
        console.log(event);
      }}
    >
      <TrackingView name="page-a">
        <TrackingZone name="zone-a">
          <Button tracking-id="show-content-a">Click me</Button>
        </TrackingZone>
      </TrackingView>
      <TrackingView name="page-b">
        <TrackingZone name="zone-b">
          <Button tracking-id="show-content-b">Click me</Button>
        </TrackingZone>
      </TrackingView>
    </TrackingRoot>
  );
}
```

## Motivation

The larger web applications grows, the harder it is to provide predictable and traceable tracking structures. Consider our usual analytics event dispatching:

```jsx
import React, { useContext } from 'react';
import { TrackingContext } from 'your-tracking';

function Button({ onClick, label, category, value, dispatch, children }) {
  let handler = onClick;

  if (dispatch) {
    handler = e => {
      dispatch({ label, category, value, action: 'click' });
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

Now, what happens if we need to define the event `category` somewhere else in the tree? For this small example might not sound like much:

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

But over time this can tightly couple our component implementation with the analytics usage. Ideally the `AccountBalance` component shouldn't have to worry about this sort of domain.

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

But again, over time this can tightly couple our component implementation with the analytics usage, and the more fields you need to overwrite, the harder it is to reason about the current state of the context, and that's where Collector can help you!

Collector was built to easily track user-interactions with high granularity. Using an agnostic event schema you can serve different tracking purposes with it. Consider the same example using Collector:

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  TrackingZone,
  useTracking,
  ACTIONS,
  COMPONENTS
} from '@sumup/collector';

function Button({ onClick, 'tracking-id': trackingId, children }) {
  const dispatch = useTracking();
  let handler = onClick;

  if (id) {
    handler = e => {
      dispatch({ id, component: COMPONENTS.button, action: ACTIONS.click });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}

function AccountBalance() {
  return (
    <Button type="submit" tracking-id="show-balance">
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

function toAnalyticsEvent({ view, zone, id, action }) {
  return {
    category: `${view}-${zone}`,
    label: id,
    action
  };
}

function App() {
  return (
    <TrackingRoot
      name="my-app"
      onDispatch={event => {
        window.dataLayer.push(toAnalyticsEvent(event));
      }}
    >
      <AccountPage />
    </TrackingRoot>
  );
}
```

For more information about the event schema and component structure, please refer to the [Usage](#usage) section.

## Getting started

`npm install @sumup/collector`

## Usage

- [Schema](#schema)
- [TrackingRoot](#trackingroot)
- [TrackingView](#trackingview)
- [TrackingZone](#trackingzone)
- [Dispatching events](#dispatching-events)

### Schema

Collector's philosophy is to structure your events based on your UI hierarchy. When dispatching events this way, it's easier to reason about the event payload. Based on this image we can start discussing about the event schema:

<div align="center">

![Collector's Concept](https://user-images.githubusercontent.com/2780941/68091860-692a5c00-fe85-11e9-8a4b-d7f2bab26a04.png)

</div>

In order to support the app/view/zone hierarchy, the event schema is defined by the following keys:

```ts
interface Event {
  app: string; // The application name
  view: string; // The current "view". Can be overwritten
  zone?: string; // The current "feature"/"organism", such as a login form. Can be overwritten
  component?: 'button' | 'link'; // Which primitive dispatched the event
  id?: string;
  action: 'click' | 'hover' | 'focus' | 'blur' | 'enter-viewport';
  data?: {
    [key: string]: any;
  };
  timestamp: number; // Provided by the library when the dispatch function is called
}
```

The directives (`Root = app`, `View = view` and `Zone = zone`) are responsible for defining their respective attributes for the data structure. Whenever you dispatch an event, these values will be retrieved based on the component hierarchy, for example:

```jsx
 <TrackingRoot name="my-app" onDispatch={console.log}>
   <TrackingView name="account">
    ...
    <TrackingZone name="change-account-form">
     ...
    </TrackingZone>
   </TrackingView>
 <TrackingRoot>
```

Would yield the following structure: `{ app: 'my-app', view: 'account', zone: 'change-account-form' }`.
You can also overwrite `View` and `Zone` for complex trees:

```jsx
 <TrackingRoot name="my-app" onDispatch={console.log}>
   <TrackingView name="account">
    ...
    <TrackingZone name="change-account-form">
     ...
     <TrackingZone name="validate-account-digit">
       ...
     </TrackingZone>
    </TrackingZone>
   </TrackingView>
 <TrackingRoot>
```

Would yield the following structure: `{ app: 'my-app', view: 'account', zone: 'validate-account-digit' }`. While it may not sound like much, it is really useful for larger applications.

### TrackingRoot

The TrackingRoot is responsible for storing the `app` value and the `dispatch` function. It is recommended to have only one TrackingRoot per application.

```jsx
import React from 'react';
import { TrackingRoot } from '@sumup/collector';

function App() {
 return (
   <TrackingRoot name="app" onDispatch={e => {
     // You can easily define multipler handlers and transform the base event to support different schemas.
     window.dataLayer.push(e);
   }}>
     ...
   <TrackingRoot>
 );
}
```

### TrackingView

The TrackingView is responsible for storing the `view` value. It is recommended to have one TrackingView per "page".

```jsx
import React from 'react';
import { TrackingView } from '@sumup/collector';

function App() {
 return (
   ...
   <TrackingView name="account">
     ...
   <TrackingView>
 );
}
```

### TrackingZone

The TrackingZone is responsible for storing the `zone` value. Zones are usually a representation of a feature/organism in your application such as a form.

```jsx
import React from 'react';
import { TrackingZone } from '@sumup/collector';

function App() {
 return (
   ...
   <TrackingZone name="change-account-form">
     ...
   <TrackingZone>
 );
}
```

### Dispatching events

In order to dispatch events, you can use the `useTracking` hook:

```jsx
import React from 'react';
import { useTracking } from '@sumup/collector';

function Button({ onClick, 'tracking-id': trackingId, children }) {
  const dispatch = useTracking({ id, action: 'click', component: 'button' });
  let handler = onClick;

  if (id) {
    handler = e => {
      dispatch();
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}
```

To ensure consistency, Collector also provides out of the box `actions` and `components` for you:

```jsx
import React from 'react';
import { useTracking, ACTIONS, COMPONENTS } from '@sumup/collector';

function Button({ onClick, 'tracking-id': trackingId, children }) {
  const dispatch = useTracking();
  let handler = onClick;

  if (id) {
    handler = e => {
      dispatch({ id, component: COMPONENTS.button, action: ACTIONS.click });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}
```

The dispatch function expects an object with the following properties:

```js
{
 id: string; // optional
 action: 'click' | 'hover' | 'focus' | 'blur' | 'enter-viewport'; // required
 component?: 'button' | 'link' // optional
}
```

## Code of conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our maintainers. We will enforce the CoC.

### Maintainers

- [SumUp Web Chapter](mailto:webchapter@sumup.com)

## About SumUp

![SumUp logo](https://raw.githubusercontent.com/sumup-oss/assets/master/sumup-logo.svg?sanitize=true)

[SumUp](https://sumup.com) is a mobile-point of sale provider. It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries, already. Our engineers work in Berlin, Cologne, Sofia, and Sāo Paulo. They write code in JavaScript, Swift, Ruby, Go, Java, Erlang, Elixir, and more.

Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
