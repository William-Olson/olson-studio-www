import React from 'react';

export class Footer extends React.Component {
  public render() {
    return (
      <div className="nav">
        © 2022{' '}
        <a href="https://olson.studio" rel="noopener" target="_blank">
          Olson Studio
        </a>
        . All Rights Reserved.
      </div>
    );
  }
}
