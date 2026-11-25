// import { useState } from 'react';
import './App.css';
import StoreFormComp from './components/StoreFormComp';
import StoresPages from './pages/StorePages';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

//we have to declare it outside of the component, Because we want one shared QueryClient instance for the application.
//If you create it inside App(), React could create a new instance when the component renders again, which would mean losing the previous cache.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // 1 minute
      gcTime: 5 * 60 * 1000,      // 5 minutes
    },
  },
});

function AppContent() {
  // const [refreshKey, setRefreshKey] = useState(0);

  // const handleStoreCreated = () => {
  //   setRefreshKey((previous) => previous + 1);
  // };
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/stores" element={
          <>
            {/* <StoreFormComp onStoreCreated={handleStoreCreated} />
            <StoresPages refreshKey={refreshKey} /> */}
            <StoreFormComp />
            <StoresPages />
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;