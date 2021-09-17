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

import { Payload } from '../../types';

/**
 * Reference:
 *  https://www.simoahava.com/gtm-tips/remember-to-flush-unused-data-layer-variables/
 *
 * GetFlushedPayload will aggregate custom parameters based on previous payload history
 * and set all previous value to undefined. By setting to undefined, GTM will flush the
 * variable and not polluting next states of datalayer.
 * @param previousPayloads payload history
 * @param payload new payload
 */
export function getFlushedPayload(
  previousPayloads: Payload[],
  payload: Payload,
): Payload {
  const aggregatedParameters = previousPayloads.reduce((accu, current) => {
    const customParams = current.customParameters || {};
    return { ...accu, ...customParams };
  }, {});

  // reset values to undefined in an object
  const resettedParameters = Object.keys(aggregatedParameters).reduce(
    (accu, key) => ({
      ...accu,
      [key]: undefined,
    }),
    {},
  );

  const flushedPayload = {
    ...payload,
    customParameters: {
      ...resettedParameters,
      ...payload.customParameters,
    },
    /**
     * GTM property to prevent recursive merge of nested object/array
     * inside customParameters.
     * Ref: https://www.simoahava.com/analytics/two-simple-data-model-tricks/
     * */
    _clear: true,
  };

  return flushedPayload;
}
