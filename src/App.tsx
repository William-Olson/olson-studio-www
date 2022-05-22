import { ReactElement } from 'react'
import logo from './logo.svg'

function App(): ReactElement {
  return (
    <div className="border-4 border-accent rounded-xl p-20 shadow-xl text-center">
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
        <p className="text-xs">( More content coming soon )</p>
      </header>
    </div>
  )
}

export default App
