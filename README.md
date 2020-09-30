<div align="center">

# Collector

Collector is a library of React components and hooks that facilitates contextual user-interaction tracking for complex interfaces with a predictable event schema.

[![Stars](https://img.shields.io/github/stars/sumup-oss/collector?style=social)](https://github.com/sumup-oss/collector/) [![Version](https://img.shields.io/npm/v/@sumup/collector)](https://www.npmjs.com/package/@sumup/collector) [![License](https://img.shields.io/badge/license-Apache%202-lightgrey.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

</div>

## Table of Contents <!-- omit in toc -->

- [Concepts](#concepts)
  - [Problem Statement](#problem-statement)
  - [Event Schema](#event-schema)
  - [Page View](#page-view)
- [Installation](#installation)
- [Usage](#usage)
  - [TrackingRoot](#trackingroot)
  - [TrackingView](#trackingview)
  - [TrackingElement](#trackingelement)
  - [useClickTrigger](#useclicktrigger)
  - [useSubmitTrigger](#usesubmittrigger)
  - [usePageViewTrigger](#usepageviewtrigger)
- [Code of Conduct (CoC)](#code-of-conduct-coc)
  - [Maintainers](#maintainers)
- [About SumUp](#about-sumup)

<details>
  <summary><strong>TL;DR</strong></summary>

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
  const handleClick = (event) => {
    if (trackingId) {
      dispatch({ label: trackingId, component: 'button' });
    }
    if (onClick) {
      onClick(event);
    }
  };

  return <button onClick={handleClick}>{children}</button>;
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

</details>

## Concepts

### Problem Statement

High-quality event tracking data requires contextual information. When a user interacts with your application, for example by clicking a button, it is useful to know where this button is located in the page hierarchy to put the event in context. The larger a web applications grows, the harder it becomes to provide predictable and traceable tracking structures.

A full example of these challenges is outlined in the [motivation](https://github.com/sumup-oss/collector/blob/master/MOTIVATION.md) document.

Collector was built to track user-interactions with contextual information and high granularity. Using an agnostic event schema you can serve different tracking purposes with it.

### Event Schema

Collector's philosophy is to structure your events based on your UI hierarchy. When dispatching events this way, it's easier to reason about the event payload. Based on this image we can start discussing about the event schema:

<div align="center">

![Collector's Concept](https://user-images.githubusercontent.com/2780941/90146083-ee319280-dd80-11ea-88fe-a940dc4b695e.png)

</div>

In order to support the app/view/elements hierarchy, the event schema is defined by the following keys:

```ts
interface Event {
  app: string; // The application name
  view: string; // The current "view". Can be overwritten
  elementTree: string[]; // The current list of rendered <TrackingElement /> down to the dispatched event
  component?: 'button' | 'link'; // Which primitive dispatched the event
  label?: string;
  event: 'click' | 'view' | 'load' | 'page-view' | 'submit' | 'browser-back'; // This property is added internally based on the kind of event you dispatched.
  timestamp: number; // This property is added internally when the dispatch function is called
  customParameters?: {
    [key: string]: any;
  };
}
```

The directives (`TrackingRoot = app`, `TrackingView = view` and `TrackingElement = elementTree`) are responsible for defining their respective attributes for the data structure. Whenever you dispatch an event, these values will be retrieved based on the component hierarchy, for example:

```jsx
 <TrackingRoot name="my-app" onDispatch={console.log}>
   <TrackingView name="account">
    ...
    <TrackingElement name="change-account-form">
     ...
      <TrackingElement name="validate-bank-account">
      ...
      </TrackingElement>
    </TrackingElement>
   </TrackingView>
 <TrackingRoot>
```

Would yield the following structure: `{ app: 'my-app', view: 'account', elementTree: ['change-account-form', 'validate-bank-account'] }`.

### Page View

Traditionally a "page view" is defined as "an instance of a page being loaded (or reloaded) in a browser" (from [Google](https://support.google.com/analytics/answer/6086080?hl=en) for Google Analytics). With single page applications (SPAs) internally navigating from one page to another page will not lead to a full page load, as the content needed to display a new page is dynamically inserted. Thus Collector's definition of a "page view" includes these additional scenarios.

The following rule set describes the most common events that trigger page views:

- The page is initially loaded (or reloaded) in the browser (a full page load takes place) and active (in focus).
- A significant visual change of the page has taken place, such as:
  - An overlying modal, visually blocking (and deactivating) the underlying content has appeared (e.g. registration / login modals, cookie notifications, or product information modals).
  - Inversely, when the pages underlying content becomes visible / active again, after a modal was closed.
  - The main contents of a page have changed due to filtering or searching on that page (e.g. a product list is filtered or ordered by the lowest price).
- A new page component has been mounted (after the initial page load), leading to a route change and the route change is completed (i.e. the path of the URL has changed).
- A browser window / tab displaying a page is activated (in focus) after being inactive (blurred).

## Installation

Collector needs to be installed as a dependency via the [Yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com) package managers. The npm CLI ships with [Node](https://nodejs.org/en/). You can read how to install the Yarn CLI in [their documentation](https://yarnpkg.com/en/docs/install).

Depending on your preference, run one of the following.

```sh
# With Yarn
$ yarn add @sumup/collector

# With npm
$ npm install @sumup/collector
```

Collector requires [`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) v16.8+ as peer dependencies.

## Usage

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

> The above code snippet demonstrates how to push the events to the Google Analytics data layer. This is just an example, Collector is agnostic of the analytics solution you use. In fact it's not even tied to analytics, you could just as well send the data to a structured logging service or anywhere else.

### TrackingView

The TrackingView is responsible for storing the `view` value. It is recommended to have one TrackingView per ["page view"](#page-view).

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

### useClickTrigger

`useClickTrigger` provides you a dispatch function for any kind of click event.

The dispatch function accepts the following interface:

```jsx
interface Options {
  component?: string;
  label?: string;
  customParameters?: {
    [key: string]: any
  };
  event: 'click'; // Added internally by the hook
  timestamp: number; // Added internally when the dispatch function is called
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

### useSubmitTrigger

`useSubmitTrigger` provides you a dispatch function for any kind of form submission event.

The dispatch function accepts the following interface:

```jsx
interface Options {
  component?: string;
  label?: string;
  customParameters?: {
    [key: string]: any
  };
  event: 'submit'; // Added internally by the hook
  timestamp: number; // Added internally when the dispatch function is called
}
```

```jsx
import React from 'react';
import { useSubmitTrigger } from '@sumup/collector';

function Form({ children }) {
  const dispatch = useSubmitTrigger();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch({ component: 'form' });
  };

  return <form onSubmit={handler}>{children}</form>;
}
```

### usePageViewTrigger

`usePageViewTrigger()` lets you dispatch a [page view](#page-view) event.

The `pageView` event will be dispatched with:

```ts
interface Event {
  app: string;
  view: string;
  event: 'page-view'; // Added internally by the hook
  timestamp: number; // Added internally by the library when the dispatch function is called
}
```

In order to have a meaningful page view event, we recommend integrating the available hooks for page view after declaring the [TrackingRoot](#trackingroot) in your application.

You don't need to declare it after the [TrackingView](#trackingview) since any `TrackingView` component will overwrite the context value.

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

`usePageActiveTrigger` **automatically** dispatches an event whenever the tab becomes active again after being inactive (via [Visibility change](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)). This is meant to be used whenever you want to track if people are changing tabs.

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

## Code of Conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our maintainers. We will enforce the CoC.

### Maintainers

- [Fernando Fleury](mailto:fernando.fleury@sumup.com)
- [Shih Yen Hwang](mailto:shih.yen.hwang@sumup.com)
- [SumUp Web Chapter](mailto:webchapter@sumup.com)

## About SumUp

![SumUp logo](https://raw.githubusercontent.com/sumup-oss/assets/master/sumup-logo.svg?sanitize=true)

[SumUp](https://sumup.com) is a mobile-point of sale provider. It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries, already. Our engineers work in Berlin, Cologne, Sofia, and Sāo Paulo. They write code in JavaScript, Swift, Ruby, Go, Java, Erlang, Elixir, and more.

Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
