import React from 'react';

export interface TooltipProps {
  text: string;
}

export class Tooltip extends React.Component<TooltipProps> {
  render() {
    return (
      <div
        className="studio-tooltip"
        data-studio-tooltip-text={this.props.text}
      >
        {this.props.children}
      </div>
    );
  }
}
