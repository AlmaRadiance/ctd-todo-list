import {useLocation,useNavigate} from 'react-router';
import {useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext.jsx';

function RequireAuth({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


useEffect(() => {
    if(!isAuthenticated) {
        navigate('/login', {state: {from: location}, replace: true});
    }
}, [isAuthenticated, navigate, location]);
if (!isAuthenticated) {
    return <div><p>Redirecting to login...</p></div>;
} 
    return children;
}

export default RequireAuth;