import React, { ReactElement } from 'react'

interface LandingCardProps {
  logoSrc?: string
  destination: string
  name?: string
  subText?: string
}

class LandingCard extends React.Component<LandingCardProps> {
  public render(): ReactElement {
    const mainBoxClasses: string = [
      'hover:animate-pulse',
      'bg-white',
      'hover:bg-dark',
      'hover:text-light',
      'text-black',
      'group',
      'h-[192px]',
      'rounded',
      'mb-9',
      'border-4',
      'border-dark',
      'p-9',
      'w-48',
      'cursor-pointer',
      'text-center'
    ].join(' ')

    return (
      <a
        href={this.props.destination}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center aspect-square mx-6"
      >
        <div className={mainBoxClasses}>
          {this.props.logoSrc && (
            <div className="flex justify-center">
              <img src={this.props.logoSrc} className="h-32 w-32" alt="logo" />
            </div>
          )}
          <h1 className="text-4xl -mt-24 text-white hidden group-hover:block pb-12">
            {this.props.name || 'Frankie'}
          </h1>
          {/* <h1 className="text-2xl font-mono pb-3">
            {this.props.name || 'Frankie'}
          </h1>
          <p></p>
          <p className="text-xs">
            {this.props.subText ||
              this.props.destination ||
              'frankie.olson.studio'}
          </p> */}
        </div>
      </a>
    )
  }
}

export default LandingCard
