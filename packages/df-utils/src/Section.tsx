import React from 'react';
import { BareProps } from '@polkadot/ui-app/types';

type Props = BareProps & {
  className?: string,
  title?: JSX.Element | string,
  level?: number
};

export default class Section extends React.PureComponent<Props> {

  render () {
    let { className, children } = this.props;
    className = (className || '') + ' DfSection';

    return (
      <section className={className}>
        {this.renderTitle()}
        <div>{children}</div>
      </section>
    );
  }

  private renderTitle = () => {
    const { title, level = 2 } = this.props;
    if (!title) return null;

    const className = 'DfSection-title';
    return React.createElement(
      `h${level}`,
      { className },
      title
    );
  }
}
