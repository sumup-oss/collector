/**
 * Copyright 2020, SumUp Ltd.
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

import { Events, Payload } from '../../types';

import getFlushedPayload from './getFlushedPayload';

const baseEvent1: Payload = {
  app: 'app',
  view: 'view',
  elementTree: [],
  event: Events.click,
  timestamp: 1,
  customParameters: { A: 'A', B: true, C: [1, 2, 3] }
};

const baseEvent2: Payload = {
  app: 'app',
  view: 'view',
  elementTree: [],
  event: Events.click,
  timestamp: 2,
  customParameters: { D: { A: 'D' } }
};

describe('getFlushedPayload', () => {
  it('should set unused custom parameters to undefined based on payloads history', () => {
    const previousPayloads = [baseEvent1, baseEvent2];
    const payload = {
      ...baseEvent1,
      customParameters: { B: false, C: 'string' }
    };
    const result = getFlushedPayload(previousPayloads, payload);
    expect(result).toStrictEqual({
      ...baseEvent1,
      _clear: true,
      customParameters: { A: undefined, B: false, C: 'string', D: undefined }
    });
  });

  it('should be an aggregated object when no new custom parameters present', () => {
    const previousPayloads = [baseEvent1, baseEvent2];
    const payload = {
      app: 'app',
      view: 'view',
      elementTree: [],
      event: Events.click,
      timestamp: 3
    };
    const result = getFlushedPayload(previousPayloads, payload);
    expect(result).toStrictEqual({
      ...payload,
      _clear: true,
      customParameters: {
        A: undefined,
        B: undefined,
        C: undefined,
        D: undefined
      }
    });
  });

  it('should be new payload when no previous custom paramaters is found', () => {
    const payload = {
      app: 'app',
      view: 'view',
      elementTree: [],
      event: Events.click,
      timestamp: 4
    };
    const previousPayloads = [payload];
    const result = getFlushedPayload(previousPayloads, baseEvent1);
    expect(result).toStrictEqual({
      ...baseEvent1,
      _clear: true
    });
  });
});
