import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { GoogleAuthCallback } from './components/login/GoogleAuthCallback';
import { LoginComponent } from './components/login/Login';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeComponent } from './components/pages/Home';
import { ProfilePage } from './components/pages/profile/ProfilePage';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="/oauth2/redirect/google"
            element={<GoogleAuthCallback />}
          />
          <Route path="login" element={<LoginComponent />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* root component */}
          <Route path="" element={<HomeComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
