import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { GoogleAuthCallback } from './components/login/GoogleAuthCallback';
import { LoginComponent } from './components/login/Login';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeComponent } from './components/pages/Home';
import { ProfilePage } from './components/pages/profile/ProfilePage';
import { CreateChartForm } from './components/forms/CreateChartForm';
import { AdminCharts } from './components/pages/charts/AdminChartsPage';
import { CreateChoreForm } from './components/forms/CreateChoreForm';
import { AdminChartOverview } from './components/pages/charts/AdminChartOverview';
import { AdminChoreChartEventsDashboard } from './components/pages/charts/AdminChoreChartEventsDashboard';

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

          {/* admin chore charts */}
          <Route path="chore-charts" element={<AdminCharts />} />
          <Route
            path="chore-chart-events"
            element={<AdminChoreChartEventsDashboard />}
          />
          <Route path="chore-charts/:id" element={<AdminChartOverview />} />
          <Route path="create-chore-chart" element={<CreateChartForm />} />
          <Route
            path="chore-charts/:id/create-chore"
            element={<CreateChoreForm />}
          />
          {/* root component */}
          <Route path="" element={<HomeComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
