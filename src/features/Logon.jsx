import {useState} from 'react';
import {useAuth} from '../contexts/AuthContext.jsx';
function Logon () {

    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');
        const result = await login(email, password);
        if (!result.success) {
            setAuthError(result.error);
        }
        setIsLoggingOn(false);
    }
   


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

export default Logon; 