/**
 * Copyright 2021, SumUp Ltd.
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

import { Payload } from '../types';

export const getFlushedDataLayerEventPayload = (
  previousPayloads: Payload[],
  payload: Payload
): Payload => {
  // flushing next payload based on previous dispatched
  const { customParameters, ...restOfNextPayload } = payload;

  const flushedCustomParameters = previousPayloads.reduce(
    (flushed, currentPayload) => {
      const currentCustomParams = currentPayload.customParameters || {};

      const resettedParameters = Object.keys(currentCustomParams).reduce(
        (obj, item) => ({
          ...obj,
          [item]: undefined
        }),
        {}
      );
      return { ...flushed, ...resettedParameters };
    },
    {}
  );

  const flushedPayload = {
    ...restOfNextPayload,
    customParameters: {
      ...flushedCustomParameters,
      ...customParameters
    },
    _clear: true
  };

  return flushedPayload;
};
