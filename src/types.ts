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

export interface Event {
  app: string;
  view: string;
  zone?: string;
  component?: string;
  id?: string;
  action: string;
  timestamp: number;
  data?: {
    [key: string]: any;
  };
}

export interface TrackingContextKeys {
  app: string;
  view: string;
  zone: string;
  dispatch?: (e: Event) => void;
}

export interface TrackingProviderProps {
  name: string;
  children: React.ReactNode;
}

export type Actions = 'click' | 'hover' | 'focus' | 'blur' | 'enter-viewport';
export type Components = 'button' | 'link';
