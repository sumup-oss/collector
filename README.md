[![License](https://img.shields.io/badge/license-Apache%202-lightgrey.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

<div align="center">

# Collector

Collector is a collection of React components that facilitates user-interaction tracking for complex interfaces with a predictable event structure.

</div>

##### Table of contents

- [TLDR](#tldr)
- [Motivation](#motivation)
- [Installing](#installing)
  - [NPM](#npm)
  - [yarn](#yarn)
- [Usage](#usage)
  - [Schema](#schema)
  - [TrackingRoot](#trackingroot)
  - [TrackingView](#trackingview)
  - [TrackingElement](#trackingelement)
  - [Dispatching events](#dispatching-events)
- [Code of conduct (CoC)](#code-of-conduct-coc)
  - [Maintainers](#maintainers)
- [About SumUp](#about-sumup)

## TLDR

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  TrackingElement,
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

function App() {
  return (
    <TrackingRoot
      name="my-app"
      onDispatch={(event) => {
        console.log(event);
      }}
    >
      <TrackingView name="page">
        <TrackingElement name="element-a">
          <Button tracking-label="show-content-a">Click me</Button>
        </TrackingElement>

        <TrackingElement name="element-b">
          <Button tracking-label="show-content-b">Click me</Button>
        </TrackingElement>
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

Collector was built to track user-interactions with high granularity. Using an agnostic event schema you can serve different tracking purposes with it. Consider the same example using Collector:

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  TrackingElement,
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
    <TrackingElement name="balance">
      ...,
      <ShowBalance />
    </TrackingElement>
  );
}

function toAnalyticsEvent({ view, elementTree, label, action }) {
  return {
    category: `${view}-${elementTree.join('-')}`,
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

For more information about the event schema and component structure, please refer to the [Usage](#usage) section.

## Installing

### NPM

`npm install @sumup/collector`

### yarn

`yarn add @sumup/collector`

## Usage

- [Schema](#schema)
- [TrackingRoot](#trackingroot)
- [TrackingView](#trackingview)
- [TrackingElement](#trackingelement)
- [Dispatching events](#dispatching-events)

### Schema

Collector's philosophy is to structure your events based on your UI hierarchy. When dispatching events this way, it's easier to reason about the event payload. Based on this image we can start discussing about the event schema:

<div align="center">

![Collector's Concept](![Collector's Concept](https://user-images.githubusercontent.com/2780941/90146083-ee319280-dd80-11ea-88fe-a940dc4b695e.png))

</div>

In order to support the app/view/element hierarchy, the event schema is defined by the following keys:

```ts
interface Event {
  app: string; // The application name
  view: string; // The current "view". Can be overwritten
  elementTree: string[]; // The current list of rendered <TrackingElement /> down to the dispatched event
  component?: 'button' | 'link'; // Which primitive dispatched the event
  label?: string;
  event: 'click' | 'view' | 'load' | 'page-view' | 'submit' | 'browser-back'; // This action is handled internally based on the kind of event you dispatched
  customParameters?: {
    [key: string]: any;
  };
  timestamp: number; // Provided by the library when the dispatch function is called
}
```

The directives (`Root = app`, `View = view` and `Element = elementTree`) are responsible for defining their respective attributes for the data structure. Whenever you dispatch an event, these values will be retrieved based on the component hierarchy, for example:

```jsx
 <TrackingRoot name="my-app" onDispatch={console.log}>
   <TrackingView name="account">
    ...
    <TrackingElement name="change-account-form">
     ...
     <TrackingElement name="validate-account-digit">
       ...
     </TrackingElement>
    </TrackingElement>
   </TrackingView>
 <TrackingRoot>
```

Would yield the following structure: `{ app: 'my-app', view: 'account', elementTree: ['change-account-form', 'validate-account-digit'] }`. While it may not sound like much, it is really useful for larger applications.

### TrackingRoot

The TrackingRoot is responsible for storing the `app` value and the `dispatch` function. It is recommended to have only one TrackingRoot per application.

```jsx
import React from 'react';
import { TrackingRoot } from '@sumup/collector';

function App() {
 const handleDispatch = React.useCallback((event) => {
   // You can define multipler handlers and transform the base event to support different schemas.
   window.dataLayer.push(event)
 }, []);

 return (
   <TrackingRoot name="app" onDispatch={handleDispatch}>
     ...
   <TrackingRoot>
 );
}
```

To avoid unnecessary renders, we recommend providing `onDispatch` as a memoized function.

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

### TrackingElement

The TrackingElement is responsible for storing the current `element` value. Elements are usually a representation of a feature/organism in your application such as a form.

```jsx
import React from 'react';
import { TrackingElement } from '@sumup/collector';

function App() {
 return (
   ...
   <TrackingElement name="change-account-form">
     ...
     <TrackingElement name="forgot-password">
      ...
     </TrackingElement>
   <TrackingElement>
 );
}
```

### Dispatching events

Here are a list of supported events you can dispatch using pre-defined hooks:

- [click](#click)
- [pageView](#pageView)
- view (to be implemented)
- load (to be implemented)
- submit (to be implemented)
- browserBack (to be implemented)

## Click

`useClickTrigger` provides you a dispatch function for any kind of click event.

The dispatch function accepts the following interface:

```jsx
interface Options {
  component?: string;
  label?: string;
  customParameters?: {
    [key: string]: any
  };
}
```

```jsx
import React from 'react';
import { useClickTrigger } from '@sumup/collector';

function Button({ onClick, 'tracking-label': label, children }) {
  const dispatch = useClickTrigger();
  let handler = onClick;

  if (label) {
    handler = (e) => {
      dispatch({ label, component: 'button' });
      onClick && onClick(e);
    };
  }

  return <button onClick={handler}>{children}</button>;
}
```

## PageView

### What can be considered a page view?

- Page load
- Route changes in SPAs
- New "context" over the screen being displayed, such as modals.

The `pageView` event will be dispatched with:

```ts
interface Event {
  app: string;
  view: string;
  event: 'page-view'; // Provided by available hooks
  timestamp: number; // Provided by the library when the dispatch function is called
}
```

### Where to place the page view hook in your application

In order to have a meaningful page view event, we recommend integrating the available hooks for page view after declaring the [TrackingRoot](#trackingroot) in your application.

You don't need to declare it after the [TrackingView](#trackingview) since any `TrackingView` component will overwrite the context value.

### Available hooks

`usePageViewTrigger()` lets you dispatch a page view event.

```jsx
import React from 'react';
import {
  TrackingRoot,
  TrackingView,
  usePageViewTrigger
} from '@sumup/collector';

interface Props {
  children: React.ReactNode;
  location: string;
}

// This could be a hook instead
function PageView({ location, children }: Props) {
  const dispatchPageView = usePageViewTrigger();

  // run the effect everytime location changes
  useEffect(() => {
    dispatchPageView();
  }, [location]);

  return children;
}
```

`usePageActiveTrigger` **automatically** dispatchs an event whenever the tab becomes inactive and then active again (via [Visibility change](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)). This is meant to be used whenever you want to track if people are changing tabs.

Keep in mind only one "pageActive" trigger is required since it's a document event listener.

```jsx
import React from 'react';
import { usePageActiveTrigger } from '@sumup/collector';

interface Props {
  children: React.ReactNode;
  location: string;
}

function PageActive({ location, children }: Props) {
  usePageActiveTrigger();

  return children;
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
