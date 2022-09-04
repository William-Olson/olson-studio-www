import type { CSSProperties } from 'react';
import React from 'react';
import { darkIcon, lightIcon } from './GoogleIcon';
import { inject, observer } from 'mobx-react';

import { DarkModeState } from '../../stores/DarkModeStore';

interface GoogleButtonProps {
  sizeWidth?: string;
  onClick: () => void;
  darkMode?: typeof DarkModeState;
}

const GoogleButtonComponent: React.FC<GoogleButtonProps> = (
  props: GoogleButtonProps
) => {
  const googleBtnStyles: CSSProperties = {
    width: props.sizeWidth,
    margin: '30px 5px',

    // light css
    backgroundColor: '#FFFFFF'
  };

  // dark css
  if (props.darkMode?.isDark) {
    googleBtnStyles.backgroundColor = '#4285F4';
    googleBtnStyles.color = 'white';
  }

  return (
    <div className="w-full center-block p-6">
      <button
        style={googleBtnStyles}
        onClick={props.onClick}
        className="flex w-96 h-29 font-medium rounded-md focus:ring-2 focus:ring-offset-2"
      >
        <span>{props.darkMode?.isDark ? darkIcon() : lightIcon()} </span>
        <span className="m-auto">Sign in with Google . . .</span>
      </button>
    </div>
  );
};

export const GoogleButton: React.FC<GoogleButtonProps> = inject(
  ({ darkMode }) => ({
    darkMode: darkMode as typeof DarkModeState
  })
)(observer(GoogleButtonComponent));
