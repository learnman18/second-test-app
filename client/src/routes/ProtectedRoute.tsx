import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

//protected route component that checks if the user is authenticated before rendering the child components.
// If the user is not authenticated, it redirects them to the login page. and if the user is authenticated,
// it renders the child components using the Outlet which matches the nested routes defined in the App.tsx file.
// for example if the user is authenticated and searching for /store page Outlet will redirect to store page.

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />; //if the token is not available or not logged in and user tries to open any other protected route for example /store it will redirect to /login page
  }

  return <Outlet />;
};

export default ProtectedRoute;