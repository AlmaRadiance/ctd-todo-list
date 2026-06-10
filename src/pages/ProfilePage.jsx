
import {useState, useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext.jsx';
function ProfilePage() {
    const {email, token} = useAuth();
    const [todoStats, setTodoStats] = useState({total: 0, completed:0, active: 0});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


useEffect(() => {
    async function fetchTodoStats() {
        if(!token) return;
        try {
            setLoading(true);
            setError('');
            const options = {
                method: 'GET',
                headers: {'X-CSRF-TOKEN': token},
                credentials: 'include',
            };
            const response = await fetch('/api/tasks', options);
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            if(!response.ok) {
                throw new Error('Failed to fetch todos');
            }
           
            const data = await response.json();
             const total = data.tasks.length;
            const completed = data.tasks.filter((todo) => todo.isCompleted).length;

            const active = total - completed;
            setTodoStats({total, completed, active});
        } catch (err) {
            setError(`Error loading statistics: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }
    fetchTodoStats();
}, [token]);

return (
  <div>
    <h2>Profile</h2>
    <section>
        <h3>Account Information</h3>
        <p>Name: {email}</p>
        <p>Status: Authenticated</p>
    </section>
    <section>
        <h3>Todo Statistics</h3>
        {loading && <p>Loading statistics...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
            <>
                <p>Total: {todoStats.total}</p> 
                <p>Completed: {todoStats.completed}</p>
                <p>Active: {todoStats.active}</p>
                {todoStats.total > 0 && (
                    <p>Completion: {Math.round((todoStats.completed/todoStats.total)*100)}%</p>
                )}
             </>
            )}
            </section>
        </div>
    );
}

export default ProfilePage;