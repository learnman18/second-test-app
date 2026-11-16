import { useState } from 'react';
import Welcome from './components/Welcome';
import './App.css';
import StoreFormComp from './components/StoreForm';
import StoresPage from './pages/StorePages';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStoreCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const token = 'YOUR_VALID_TEST_TOKEN';

  return (
    <>
      <Welcome name="Admin" />

      <StoreFormComp
        token={token}
        onStoreCreated={handleStoreCreated}
      />

      <StoresPage
        token={token}
        refreshKey={refreshKey}
      />
    </>
  );
}

export default App;