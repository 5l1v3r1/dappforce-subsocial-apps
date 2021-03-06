// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, EventRecord, Extrinsic } from '@polkadot/types/interfaces';

import React from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import ExtrinsicDisplay from './Extrinsic';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: EventRecord[];
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function Extrinsics ({ blockNumber, className, events, label, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table
      className={className}
      empty={t('No pending extrinsics are in the queue')}
      header={[
        [label || t('extrinsics'), 'start', 2],
        [t('events'), 'start', 2],
        [t('signer'), 'address']
      ]}
      isFixed
    >
      {value?.map((extrinsic, index): React.ReactNode =>
        <ExtrinsicDisplay
          blockNumber={blockNumber}
          events={events}
          index={index}
          key={`extrinsic:${index}`}
          value={extrinsic}
        />
      )}
    </Table>
  );
}

export default React.memo(Extrinsics);
