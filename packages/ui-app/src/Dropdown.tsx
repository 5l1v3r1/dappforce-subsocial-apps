// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import SUIDropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { isUndefined } from '@polkadot/util';

import classes from './util/classes';
import Labelled from './Labelled';

type Props<Option> = BareProps & {
  defaultValue?: any,
  isButton?: boolean,
  isDisabled?: boolean,
  isError?: boolean,
  label?: any, // node?
  onChange: (value: any) => void,
  onSearch?: (filteredOptions: Array<Option>, query: string) => Array<Option>,
  options: Array<Option>,
  placeholder?: string,
  transform?: (value: any) => any,
  value?: any,
  withLabel?: boolean
};

type SUIEvent = {
  value: string
};

export default class Dropdown<Option> extends React.PureComponent<Props<Option>> {
  componentDidMount () {
    this.componentDidUpdate({} as Props<Option>);
  }

  componentDidUpdate (prevProps: Props<Option>) {
    const { defaultValue, value } = this.props;
    const startValue = isUndefined(value)
      ? defaultValue
      : value;
    const prevStart = isUndefined(prevProps.value)
      ? prevProps.defaultValue
      : prevProps.value;

    if (startValue !== prevStart) {
      this.onChange(null, {
        value: startValue
      });
    }
  }

  render () {
    const { className, defaultValue, isButton, isDisabled, isError, label, onSearch, options, placeholder, style, withLabel, value } = this.props;
    const dropdown = (
      <SUIDropdown
        button={isButton}
        compact={isButton}
        disabled={isDisabled}
        error={isError}
        floating={isButton}
        // @ts-ignore some mismatch here, look into it
        onChange={this.onChange}
        options={options}
        placeholder={placeholder}
        // @ts-ignore some mismatch here, look into it
        search={onSearch}
        selection
        value={
          isUndefined(value)
            ? defaultValue
            : value
          }
      />
    );

    return isButton
      ? (
        <SUIButton.Group primary>
          {dropdown}
        </SUIButton.Group>
      )
      : (
        <Labelled
          className={classes('ui--Dropdown', className)}
          label={label}
          style={style}
          withLabel={withLabel}
        >
          {dropdown}
        </Labelled>
      );
  }

  onChange = (event: React.SyntheticEvent<Element> | null, { value }: SUIEvent): void => {
    const { onChange, transform } = this.props;

    onChange(
      transform
        ? transform(value)
        : value
    );
  }
}