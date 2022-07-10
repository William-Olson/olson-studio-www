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
      'sm:inline-block',
      'mr-auto',
      'ml-auto',
      'sm:mr-2',
      'sm:ml-2',
      'w-[192px]',
      'rounded',
      'mb-9',
      'p-9',
      'cursor-pointer',
      'text-center'
    ].join(' ');

    // console.log(this.props.logo);

    return (
      <div className={mainBoxClasses}>
        <a
          href={this.props.destination}
          target="_blank"
          rel="noopener"
          aria-label={this.props.subText}
        >
          <div className="w-26">{this.props.logo}</div>
          <h1 className="text-4xl -mt-24 pb-12">
            <span className="opacity-0 group-hover:opacity-100">
              {this.props.name || 'Name'}
            </span>
          </h1>
        </a>
      </div>
    );
  }
}

export default LandingCard;
