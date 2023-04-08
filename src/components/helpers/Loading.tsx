import React from 'react';

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        style={{ borderTopColor: 'transparent' }}
        className="w-8 h-8 border-4 border-accent rounded-full animate-spin"
      ></div>
      <p className="ml-2">Loading...</p>
    </div>
  );
}
