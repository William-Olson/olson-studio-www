import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { DarkModeState } from '../../stores/DarkModeStore';
import { IconTypes } from '../../types/AppTypes';
import { CustomIcon } from '../CustomIcon';

export interface LinkButtonProps {
  leftIcon?: IconTypes;
  rightIcon?: IconTypes;
  to: string;
  label?: string;
}

export class LinkButtonComponent extends React.Component<LinkButtonProps> {
  public darkMode: typeof DarkModeState = DarkModeState;
  render() {
    return (
      <Link to={this.props.to}>
        <button className="border-2 flex flex-row border-inherit rounded py-1 px-3">
          {!!this.props.leftIcon && (
            <span className="flex flex-col mr-2">
              <CustomIcon darkMode={this.darkMode} icon={this.props.leftIcon} />
            </span>
          )}
          <span className="flex flex-col">
            {this.props.label || this.props.children || 'Click Me'}
          </span>
          {!!this.props.rightIcon && (
            <span className="flex flex-col ml-2">
              <CustomIcon
                darkMode={this.darkMode}
                icon={this.props.rightIcon}
              />
            </span>
          )}
        </button>
      </Link>
    );
  }
}

export const LinkButton = observer(LinkButtonComponent);
