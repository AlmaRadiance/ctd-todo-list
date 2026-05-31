import {useState, useEffect, useCallback} from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';

function TodosPage({token}) {
 const [todoList, setTodoList] = useState([]);
 const [error, setError] = useState('');
 const [isTodoListLoading, setIsTodoListLoading] = useState(false);
 const [sortBy, setSortBy] = useState('creationDate');
 const [sortDirection, setSortDirection] = useState('desc');
 const [filterTerm, setFilterTerm] = useState('');
 const debouncedFilterTerm = useDebounce(filterTerm, 300);
 const [dataVersion, setDataVersion] = useState(0);
 const [filterError, setFilterError] = useState('');


const invalidateCache = useCallback(() => {
 
  setDataVersion(prev => prev + 1);
}, []);

 const handleFilterChange = (newTerm) => {
  setFilterTerm(newTerm);
 }

   useEffect(() => {
    if(!token) return;
    async function fetchTodos() {
        setIsTodoListLoading(true);

        try {
          const paramsObject = {
            sortBy,
            sortDirection,
          };
          if (debouncedFilterTerm) {
            paramsObject.find = debouncedFilterTerm;
          }
          const params = new URLSearchParams(paramsObject);

            const response = await fetch(`/api/tasks?${params}`, {
                headers: {'X-CSRF-TOKEN': token},
                credentials: 'include',
            });
            if(response.status === 401) {
                throw new Error ('Unauthorized');
            }
            if(!response.ok){
                throw new Error ('Failed to fetch todos');
            }
            const data = await response.json();
            setTodoList(data.tasks);
            setFilterError('');
        } catch(error){
          if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !=='desc') {
            setFilterError(`Error filtering/sorting todos: ${error.message}`);
          } else {
            setError(`Error fetching todos: ${error.message}`);
          }
            
        } finally {
            setIsTodoListLoading(false);
        }
    }
    fetchTodos();
 },[token, sortBy, sortDirection, debouncedFilterTerm]);

 async function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
  };
  setTodoList(previous => [newTodo, ...previous]);
 try {
    const response = await fetch ('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body:JSON.stringify({title:todoTitle, isCompleted: false}),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add todo');
    }
    const data = await response.json();
    setTodoList(previous => 
        previous.map(todo => (todo.id === newTodo.id ? data: todo))
    );
    invalidateCache();
 } catch (error) {
      setTodoList(previous =>
        previous.filter(todo => todo.id !== newTodo.id)
      );
      setError(error.message);
    }
  }



 async function completeTodo(id) {
  const originalTodo = todoList.find(todo => todo.id === id);
  setTodoList(previous => 
    previous.map(todo => 
        todo.id === id ? {...todo, isCompleted: true} : todo 
  )
);
   try {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token,
    },
    credentials: 'include',
    body: JSON.stringify({
      isCompleted: true,
      createdAt: originalTodo.createdAt,
    }),
  });
  invalidateCache();
} catch (error) {
  setTodoList(previous =>
    previous.map(todo => (todo.id === id ? originalTodo : todo))
  );
  setError(error.message);
}
 }



async function updateTodo(editedTodo) {
  const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
  setTodoList(previous => 
   previous.map(todo => (todo.id === editedTodo.id ? editedTodo : todo))
    );
 try {
    await fetch (`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
            createdAt: originalTodo.createdAt,
        }),
    });
    invalidateCache();
  } catch (error) {
      setTodoList(previous =>
        previous.map(todo =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );
      setError(error.message);
    }
  }


  return (
    <div>
        {error && (
            <div>
                <p>{error}</p>
                <button onClick={() => setError('')}>Clear Error</button>
            </div>
        )}

        {filterError && (
          <div>
            <p>{filterError}</p>
            <button onClick={() => setFilterError('')}>Clear Filter Error</button>
            <button onClick={() => {
              setFilterTerm('');
              setSortBy('creationDate');
              setSortDirection('desc');
              setFilterError('');
            }}>Reset Filters</button>
            </div>
        )}

        {isTodoListLoading && <p>Loading...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy} 
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo}/>
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion} 
      />
    </div>
  );
}

export default TodosPage;