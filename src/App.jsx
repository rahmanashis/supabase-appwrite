import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Main } from './components/layout/Main';
import { AuthContainer } from './components/auth/AuthContainer';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
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
    </AuthProvider>
  );
}

export default App;
