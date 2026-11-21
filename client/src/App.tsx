import { useState } from 'react';
import './App.css';
import StoreFormComp from './components/StoreFormComp';
import StoresPages from './pages/StorePages';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStoreCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/stores" element={
          <>
            <StoreFormComp onStoreCreated={handleStoreCreated} />
            <StoresPages refreshKey={refreshKey} />
          </>
        }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;