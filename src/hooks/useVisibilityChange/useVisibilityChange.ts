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

import * as React from 'react';

import usePrevious from '../usePrevious';

const useVisibilityChange = (callback: (isVisible: boolean) => void): void => {
  const [documentVisibility, setDocumentVisibility] = React.useState(
    !document.hidden
  );
  const previousVisibility = usePrevious(documentVisibility);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentVisibility(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (previousVisibility !== documentVisibility) {
    callback(documentVisibility);
  }
};

export default useVisibilityChange;
