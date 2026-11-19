import { useState } from 'react';
import Welcome from './components/Welcome';
import './App.css';
import StoreFormComp from './components/StoreFormComp';
import StoresPages from './pages/StorePages';
import { AuthProvider } from './context/AuthProivder';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/useAuth';

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { token } = useAuth();

  const handleStoreCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };
  return (
    <>
      <Welcome name="Admin" />
      {
        !token && <LoginPage />
      }

      <StoreFormComp
        onStoreCreated={handleStoreCreated}
      />

      <StoresPages
        refreshKey={refreshKey}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;