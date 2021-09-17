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

import TrackingRoot from './components/TrackingRoot';
import TrackingView from './components/TrackingView';
import TrackingElement from './components/TrackingElement';
import useClickTrigger from './hooks/useClickTrigger';
import useSubmitTrigger from './hooks/useSubmitTrigger';
import usePageViewTrigger from './hooks/usePageViewTrigger';
import usePageActiveTrigger from './hooks/usePageActiveTrigger';
import useSectionExpandedTrigger from './hooks/useSectionExpandedTrigger';
import getFlushedPayload from './plugins/getFlushedPayload';
import * as Types from './types';

export {
  TrackingRoot,
  TrackingView,
  TrackingElement,
  useClickTrigger,
  useSubmitTrigger,
  usePageViewTrigger,
  usePageActiveTrigger,
  useSectionExpandedTrigger,
  getFlushedPayload,
};

export type Dispatch = Types.Dispatch;
export type Events = Types.Events;
export type Payload = Types.Payload;
