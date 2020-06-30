[![License](https://img.shields.io/badge/license-Apache%202-lightgrey.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

<div align="center">

# Collector

Collector is a collection of React components that facilitates user-interaction tracking for complex interfaces with a predictable event structure.

</div>

##### Table of contents

- [TL;DR](#tldr)
- [Motivation](#motivation)
- [Installing](#installing)
  - [NPM](#npm)
  - [yarn](#yarn)
- [Usage](#usage)
  - [Schema](#schema)
  - [TrackingRoot](#trackingroot)
  - [TrackingView](#trackingview)
  - [TrackingZone](#trackingzone)
  - [Dispatching events](#dispatching-events)
- [Code of conduct (CoC)](#code-of-conduct-coc)
  - [Maintainers](#maintainers)
- [About SumUp](#about-sumup)

## TL;DR

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

function App() {
  return (
    <TrackingRoot
      name="my-app"
      onDispatch={(event) => {
        console.log(event);
      }}
    >
      <TrackingView name="page">
        <TrackingZone name="zone-a">
          <Button tracking-label="show-content-a">Click me</Button>
        </TrackingZone>

        <TrackingZone name="zone-b">
          <Button tracking-label="show-content-b">Click me</Button>
        </TrackingZone>
      </TrackingView>
    </TrackingRoot>
  );
}
```

## Installing

### NPM

`npm install @sumup/collector`

### yarn

`yarn add @sumup/collector`

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
  label?: string;
  event: 'click' | 'view' | 'load' | 'page-view' | 'submit' | 'browser-back'; // This action is handled internally based on the kind of event you dispatched.
  customParameters?: {
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
You can also overwrite `Zone` for complex trees:

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
