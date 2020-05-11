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

import * as React from 'react';

import { TrackingProviderProps as ProviderProps } from '../../types';
import TrackingContext from '../TrackingContext';

const TrackingView = ({ name, children }: ProviderProps) => {
  const { setView } = React.useContext(TrackingContext);

  React.useEffect(() => {
    setView && setView(name);
  }, [name]);

  // Wrapping with fragment because of a known issue in typescript
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  return <>{children}</>;
};

export default TrackingView;
