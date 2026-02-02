import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/common/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const StormTrackerPage = lazy(() => import('./pages/StormTrackerPage'));
const SeismicPage = lazy(() => import('./pages/SeismicPage'));
const OperationsPage = lazy(() => import('./pages/OperationsPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const BuoysPage = lazy(() => import('./pages/BuoysPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SettingsProvider>
          <NotificationProvider>
            <HashRouter>
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/storms" element={<StormTrackerPage />} />
                    <Route path="/seismic" element={<SeismicPage />} />
                    <Route path="/operations" element={<OperationsPage />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/buoys" element={<BuoysPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            </HashRouter>
          </NotificationProvider>
        </SettingsProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
