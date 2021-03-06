// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Accounts from '@polkadot/app-accounts';

const route: Route = {
  Component: Accounts,
  display: {
    needsApi: []
  },
  i18n: {
    defaultValue: 'Accounts'
  },
  icon: 'users',
  name: 'accounts'
};

export default route;
