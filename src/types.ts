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

type ElementTree = string[];

export enum Events {
  click = 'click',
  view = 'view',
  load = 'load',
  pageView = 'page-view',
  pageReactivated = 'page-reactivated',
  submit = 'submit',
  browserBack = 'browser-back',
  sectionExpanded = 'section-expanded',
}

export interface Payload {
  app: string | undefined;
  view: string | undefined;
  elementTree: ElementTree;
  component?: string;
  label?: string;
  event: Events;
  timestamp: number;
  customParameters?: {
    [key: string]: unknown;
  };
}

export interface Dispatch {
  component?: string;
  label?: string;
  customParameters?: {
    [key: string]: unknown;
  };
}

export type DispatchFn = (dispatch: Dispatch) => void;
export interface TrackingContextKeys {
  app?: string;
  view?: string;
  elementTree: ElementTree;
  dispatch?: (payload: Payload) => void;
  setView?: (view: string) => void;
}

export interface TrackingProviderProps {
  name: string;
  children: React.ReactNode;
}
