import React, { ReactElement } from 'react';

interface LandingCardProps {
  logo?: ReactElement;
  destination: string;
  name?: string;
  subText?: string;
}

class LandingCard extends React.Component<LandingCardProps> {
  public render(): ReactElement {
    const mainBoxClasses: string = [
      'hover:animate-pulse',
      // 'bg-white',
      'hover:bg-dark',
      'hover:text-light',
      'dark:hover:bg-light',
      'dark:hover:text-black',
      'text-white',
      'group',
      'h-[192px]',
      'rounded',
      'mb-9',
      'border-4',
      'border-dark',
      'dark:border-white',
      'p-9',
      'w-48',
      'cursor-pointer',
      'text-center'
    ].join(' ');

    return (
      <a
        href={this.props.destination}
        target="_blank"
        rel="noopener"
        aria-label={this.props.subText}
        className="inline-flex items-center aspect-square mx-6"
      >
        <div className={mainBoxClasses}>
          {this.props.logo && (
            <div className="flex justify-center">{this.props.logo}</div>
          )}
          <h1 className="text-4xl -mt-24 hidden group-hover:block pb-12">
            {this.props.name || 'Frankie'}
          </h1>
        </div>
      </a>
    );
  }
}

export default LandingCard;
