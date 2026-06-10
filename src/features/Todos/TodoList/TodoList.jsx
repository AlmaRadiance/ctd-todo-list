// import {useMemo} from 'react';
// import TodoListItem from './TodoListItem.jsx';
// function TodoList({
//   todoList, 
//   onCompleteTodo,
//   onUpdateTodo, 
//   dataVersion,
//   statusFilter = 'active',
// }) {
//    const filteredTodoList = useMemo(() => {
      
//       return {
//         version: dataVersion,
//         todos: todoList.filter(todo => !todo.isCompleted),
//       }
//    }, [todoList, dataVersion])
  

//   return (
//     filteredTodoList.todos.length === 0 ? (
//       <p>Add todo above to get started</p>
//     ):(
//     <ul>
//       {filteredTodoList.todos.map(todo => 
//       (<TodoListItem 
//         key={todo.id} 
//         todo={todo} 
//         onCompleteTodo={onCompleteTodo}
//         onUpdateTodo={onUpdateTodo}
//       />
//     ))}
//     </ul>
//     )
//   );
// }

// export default TodoList;

import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = 'active',  // Add this prop with default
}) {
  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion}) - Status: ${statusFilter}`);

    let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started.';
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <p>{getEmptyMessage()}</p>
  ) : (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;