import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Main } from './components/layout/Main';
import { ServiceDashboard } from './components/services/ServiceDashboard';
import { AuthContainer } from './components/auth/AuthContainer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<ServiceDashboard />} />
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/register" element={<AuthContainer />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
