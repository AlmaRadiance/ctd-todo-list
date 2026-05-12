import {useState} from 'react';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';
import './App.css'



function App() {
 const [todoList, setTodoList] = useState([]);

 function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
  }
  setTodoList(previous => [newTodo, ...previous]);
 }

 function completeTodo(id) {
  const updatedTodoList = todoList.map(todo => {
    if (todo.id === id) {
      return {...todo, isCompleted: true};
    } else {
      return todo;
    }
  });
  setTodoList(updatedTodoList);
 };

 function updateTodo (editedTodo) {
  const updatedTodos = todoList.map(todo =>
    todo.id === editedTodo.id ? {...editedTodo} : todo
  );
  setTodoList(updatedTodos);
 }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
