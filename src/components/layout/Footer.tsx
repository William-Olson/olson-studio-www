import React from 'react';

export class Footer extends React.Component {
  public render() {
    const copyrightYear = new Date().getFullYear();
    return (
      <div className="nav">
        © {copyrightYear + ' '}
        <a href="https://olson.studio" rel="noopener" target="_blank">
          Olson Studio
        </a>
        . All Rights Reserved.
      </div>
    );
  }
}
