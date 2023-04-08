import React from 'react';

interface LoadingProps {
  heightClass?: string;
}

export function Loading(props: LoadingProps): React.ReactElement {
  const heightClass = props.heightClass || 'min-h-screen';
  return (
    <div className={'flex items-center justify-center ' + heightClass}>
      <div
        style={{ borderTopColor: 'transparent' }}
        className="w-8 h-8 border-4 border-accent rounded-full animate-spin"
      ></div>
      <p className="ml-2">Loading...</p>
    </div>
  );
}
