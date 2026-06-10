import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Handle login form submission
  async function handleSubmit(e) {
    e.preventDefault();
    // ... existing login logic
    setIsLoggingOn(true);
    setAuthError('');
    const result = await login(email, password);
    if (result.success) {
      // useEffect will handle redirect
    } else {
         setAuthError(result.error);
    }
      setIsLoggingOn(false);
  }
  
  // ... rest of component with form JSX
  return (
    <>
        {authError && <p>{authError}</p>}
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
             <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />
             <button disabled={isLoggingOn}>
                {isLoggingOn ? 'Logging in...':'Log On'}
             </button>
        </form>
    </>
    );
}

export default LoginPage;

