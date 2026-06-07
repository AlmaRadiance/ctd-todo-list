import {useEffect, useCallback, useReducer} from 'react';
import {todoReducer, initialTodoState, TODO_ACTIONS,} from '../../reducers/todoReducer.js';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';
import {useAuth} from '../../contexts/AuthContext.jsx';

function TodosPage() {
const {token} = useAuth();

const [state, dispatch] = useReducer(todoReducer, initialTodoState);
const {todoList, error, filterError, isTodoListLoading, sortBy, sortDirection, filterTerm, dataVersion,} = state;
const debouncedFilterTerm = useDebounce(filterTerm, 300);

const invalidateCache = useCallback(() => {
}, []);

 const handleFilterChange = (newTerm) => {
  dispatch ({type: TODO_ACTIONS.SET_FILTER, payload: {filterTerm: newTerm}});
 }

   useEffect(() => {
    if(!token) return;
    async function fetchTodos() {
      dispatch({
        type: TODO_ACTIONS.FETCH_START
      })
        try {
          const paramsObject = {
            sortBy,
            sortDirection,
          } 
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
            dispatch({
              type: TODO_ACTIONS.FETCH_SUCCESS,
              payload: {todos: data.tasks},
            });
        } catch(error){
      
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: `Error fetching todos: ${error.message}`,
            isFilterError: !!(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc'),
          }
        })
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
 
  dispatch({
    type: TODO_ACTIONS.ADD_TODO_START, payload: {newTodo}
  })
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
  
     const savedTodo = await response.json();
   
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_SUCCESS,
      payload: {tempId: newTodo.id, savedTodo},
    })
    invalidateCache();
 } catch (error) {
    
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {tempId: newTodo.id, message: error.message},
      });
    }
  }



 async function completeTodo(id) {
  const originalTodo = todoList.find(todo => todo.id === id);

dispatch({
  type: TODO_ACTIONS.COMPLETE_TODO_START,payload: {id}
})
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
    }),
  });
  dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS
  })
  invalidateCache();
} catch (error) {
 
  dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
    payload: {id, originalTodo, message: error.message},
  })
}
 }



async function updateTodo(editedTodo) {
  const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
 
  dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });
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
           
        }),
    });
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
    })
    invalidateCache();
  } catch (error) {
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_ERROR, 
      payload: {id: editedTodo.id, originalTodo, message: error.message},
    })
     
    }
  }


  return (
    <div>
        {error && (
            <div>
                <p>{error}</p>
                <button onClick={() => 
                  dispatch({
                  type: TODO_ACTIONS.CLEAR_ERROR
                })}
          
                  >Clear Error</button>
            </div>
        )}

        {filterError && (
          <div>
            <p>{filterError}</p>
            <button onClick={() => 
            
              dispatch({
                type: TODO_ACTIONS.CLEAR_FILTER_ERROR
              })}
              >Clear Filter Error</button>
            <button onClick={() => dispatch({
              type: TODO_ACTIONS.RESET_FILTERS
            
           

            })}>Reset Filters</button>
            </div>
        )}

        {isTodoListLoading && <p>Loading...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={
         
          (newSortBy) =>
          dispatch ({
            type: TODO_ACTIONS.SET_SORT,
            payload: {sortBy: newSortBy, sortDirection},
          })
        }
        onSortDirectionChange={
   
          (newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {sortBy, sortDirection: newSortDirection},
          })
        }
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