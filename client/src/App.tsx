import { useState } from 'react';
import Welcome from './components/Welcome';
import './App.css';
import StoreFormComp from './components/StoreFormComp';
import StoresPages from './pages/StorePages';
import { AuthProvider } from './context/AuthProivder';

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStoreCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };
  return (
    <>
      <Welcome name="Admin" />

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