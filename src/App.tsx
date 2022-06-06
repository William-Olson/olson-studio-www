import React, { ReactElement } from 'react';
import { Banner } from './components/layout/Banner';
import { CardArea } from './components/layout/CardArea';
import { Footer } from './components/layout/Footer';
import { NavBar } from './components/layout/NavBar';
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

  updateDarkMode() {
    this.setState({
      darkMode: isDarkMode(),
      darkModeType: getDarkModeType()
    });
  }

  public render(): ReactElement {
    return (
      <div className="w-full h-full">
        <div className="md:w-90 max-w-90 h-24">
          <NavBar
            onChangeDarkMode={this.updateDarkMode}
            isDark={this.state.darkMode}
            darkModeType={this.state.darkModeType}
          />
        </div>
        <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
          <Banner />
          <CardArea />
        </div>
        <div className="footer md:w-full max-w-full text-center p-8 h-24">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
