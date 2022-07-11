import type { CSSProperties } from 'react';
import React from 'react';
import { isDarkMode } from '../../util/DarkMode';
import { darkIcon, lightIcon } from './GoogleIcon';

interface GoogleButtonProps {
  sizeWidth?: string;
  onClick: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = (
  props: GoogleButtonProps
) => {
  const inDarkMode = isDarkMode();

  const googleBtnStyles: CSSProperties = {
    width: props.sizeWidth,
    margin: '30px 5px',

    // light css
    backgroundColor: '#FFFFFF'
  };

  // dark css
  if (inDarkMode) {
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
        <span>{inDarkMode ? darkIcon() : lightIcon()} </span>
        <span className="m-auto">Sign in with Google . . .</span>
      </button>
    </div>
  );
};
