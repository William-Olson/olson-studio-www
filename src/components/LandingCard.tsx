import { ReactElement } from 'react';
import {
  DarkModeComponent,
  DarkModeComponentProps
} from './helpers/DarkModeComponent';

interface LandingCardProps extends DarkModeComponentProps {
  logo?: ReactElement;
  destination: string;
  name?: string;
  subText?: string;
}

class LandingCard extends DarkModeComponent<LandingCardProps> {
  public render(): ReactElement {
    const mainBoxClasses: string = [
      'hover:animate-pulse',
      'hover:bg-dark',
      'hover:text-light',
      'dark:hover:bg-light',
      'dark:hover:text-black',
      'dark:border-white',
      'text-white',
      'border-4',
      'border-dark',
      'group',
      'h-[192px]',
      'rounded',
      'mb-9',
      'p-9',
      'w-48',
      'cursor-pointer',
      'text-center'
    ].join(' ');

    // console.log(this.props.logo);

    return (
      <a
        href={this.props.destination}
        target="_blank"
        rel="noopener"
        aria-label={this.props.subText}
        className="inline-flex items-center aspect-square mx-6"
      >
        <div className={mainBoxClasses}>
          <div className="md:flex justify-center">
            {this.props.logo && this.props.logo}
          </div>
          <h1 className="text-4xl -mt-24 hidden group-hover:block pb-12">
            {this.props.name || 'Name'}
          </h1>
        </div>
      </a>
    );
  }
}

export default LandingCard;
