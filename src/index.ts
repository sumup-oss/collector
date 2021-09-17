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

import * as Types from './types';

export { TrackingRoot } from './components/TrackingRoot';
export { TrackingView } from './components/TrackingView';
export { TrackingElement } from './components/TrackingElement';
export { useClickTrigger } from './hooks/useClickTrigger';
export { useSubmitTrigger } from './hooks/useSubmitTrigger';
export { usePageViewTrigger } from './hooks/usePageViewTrigger';
export { usePageActiveTrigger } from './hooks/usePageActiveTrigger';
export { useSectionExpandedTrigger } from './hooks/useSectionExpandedTrigger';
export { getFlushedPayload } from './plugins/getFlushedPayload';

export type Dispatch = Types.Dispatch;
export type Events = Types.Events;
export type Payload = Types.Payload;
