import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken } = useAuth();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await loginUser({ user_email: email, password });
      setToken(response.token);
      console.log(response.message);
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Something went wrong');
    }
    setEmail('');
    setPassword('');
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
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;