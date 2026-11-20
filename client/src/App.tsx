import { useState } from 'react';
import Welcome from './components/Welcome';
import './App.css';
import StoreFormComp from './components/StoreFormComp';
import StoresPages from './pages/StorePages';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
// import { useAuth } from './context/useAuth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  // const { token } = useAuth();

  const handleStoreCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/stores" element={
          <>
            <Welcome name="Admin" />
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