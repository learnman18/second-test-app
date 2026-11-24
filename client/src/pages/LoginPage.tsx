import { useState } from 'react';
import { loginUser, LoginApiError } from '../api/authApi';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom'
import { resetUnauthorizedHandled } from '../api/apiRequest';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const { setToken } = useAuth();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setApiError('');
      setIsLoading(true);
      const response = await loginUser({ user_email: email, password });
      console.log('Login successful');
      resetUnauthorizedHandled();
      setToken(response.data.token);
      navigate('/stores'); // Redirect to the /stores page after successful login
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error instanceof LoginApiError) {
        setApiError(error.message);
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {apiError && <p role="alert">{apiError}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;