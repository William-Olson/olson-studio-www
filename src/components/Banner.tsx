import React from 'react'
import logo from '../logos/logo.svg'

export class Banner extends React.Component {
  public render() {
    return (
      <div className="p-20 w-90 text-center border-b-8 border-white">
        <header>
          <div className="flex justify-center">
            <img
              src={logo}
              className="h-32 w-32 hover:animate-spin-slow"
              alt="logo"
            />
          </div>
          <h1 className="text-6xl font-mono pb-3">Olson Studio</h1>
          <p></p>
          <p className="font-thin">Portal</p>
        </header>
      </div>
    )
  }
}
