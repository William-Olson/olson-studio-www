import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { DarkModeComponent } from './components/helpers/DarkModeComponent';
import { Footer } from './components/layout/Footer';
import { NavBar } from './components/layout/NavBar';

class App extends DarkModeComponent {
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
