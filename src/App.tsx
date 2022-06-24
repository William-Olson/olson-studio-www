import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { NavBar } from './components/layout/NavBar';
import { emitter } from './Events';
import { DarkModeTypes } from './types/AppTypes';
import { getDarkModeType, isDarkMode } from './util/DarkMode';

interface AppProps {}
interface AppState {
  darkMode: boolean;
  darkModeType: DarkModeTypes;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.updateDarkMode = this.updateDarkMode.bind(this);
    this.state = {
      darkMode: isDarkMode(),
      darkModeType: getDarkModeType()
    };
  }

  componentDidMount() {
    emitter.on('darkMode', this.updateDarkMode);
  }

  componentWillUnmount() {
    emitter.off('darkMode', this.updateDarkMode);
  }

  updateDarkMode() {
    console.log('in app.tsx update darkMode');
    this.setState({
      darkMode: isDarkMode(),
      darkModeType: getDarkModeType()
    });
  }

  public render(): ReactElement {
    return (
      <div className="w-full h-full">
        <div className="md:w-90 max-w-90 h-56px">
          <NavBar />
        </div>
        <div className="content-wrapper">
          <Outlet />
        </div>
        <div className="footer md:w-full max-w-full text-center p-36px h-24px">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
