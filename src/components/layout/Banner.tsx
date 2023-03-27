import React, { ReactElement } from 'react';

interface BannerProps {
  headingText: string;
  subText?: string;
  logo?: ReactElement;
}

export class Banner extends React.Component<BannerProps> {
  public render() {
    return (
      <React.Fragment>
        <div className="pb-20 w-90 text-center">
          <header>
            {!!this.props.logo && (
              <div className="flex justify-center">
                <div className="h-32 w-32">{this.props.logo}</div>
              </div>
            )}
            <h1 className="text-6xl font-mono pb-3">
              {this.props.headingText}
            </h1>
            <p></p>
            {!!this.props.subText && (
              <p className="font-sans font-bold from-accent-dark to-white">
                {this.props.subText}
              </p>
            )}
          </header>
        </div>
      </React.Fragment>
    );
  }
}
