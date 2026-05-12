import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import {isValidTodoTitle} from '../utils/todoValidation';

function TodoForm({onAddTodo}) {
 const inputRef = useRef();
const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();


    // .trim prevents whitespace only todos
    // const todoTitle = event.target.todoTitle.value.trim();
    const todoTitle = workingTodoTitle.trim();
    if (todoTitle) {
      onAddTodo(todoTitle);
      // event.target.reset();
      setWorkingTodoTitle('');
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
         {/* <label htmlFor="todoTitle">Todo</label>
      <input
      ref={inputRef}
      type="text"
      id="todoTitle"
      name="todoTitle"
      placeholder={'Todo text'}
      required
      value={workingTodoTitle}
      onChange={(event)=>setWorkingTodoTitle(event.target.value)}
    /> */}
    <TextInputWithLabel
      ref={inputRef}
      value={workingTodoTitle}
      onChange={(event)=>setWorkingTodoTitle(event.target.value)}
      elementId="todoTitle"
      labelText="Todo"
    />
{/* <button type="submit" disabled={!workingTodoTitle.trim()}>
      Add Todo
    </button> */}
    <button disabled = {!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
    </form>
  );
}

export default TodoForm;