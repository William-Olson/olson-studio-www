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
      'bg-accent',
      'text-white',
      'border-4',
      'border-accent-dark',
      'mb-9',
      'border-collapse',
      'rounded-xl',
      'p-9',
      'shadow-xl',
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
              <img src={this.props.logoSrc} className="h-12 w-12" alt="logo" />
            </div>
          )}
          <h1 className="text-2xl font-mono pb-3">
            {this.props.name || 'Frankie'}
          </h1>
          <p></p>
          <p className="text-xs">
            {this.props.subText ||
              this.props.destination ||
              'frankie.olson.studio'}
          </p>
        </div>
      </a>
    )
  }
}

export default LandingCard
