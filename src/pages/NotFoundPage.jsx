import { Link } from 'react-router';

function NotFoundPage() {
    return(
    <div>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist</p>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    </div>
    );
}
export default NotFoundPage; 

