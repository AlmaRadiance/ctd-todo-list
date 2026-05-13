import {useState} from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';


function TodoListItem ({todo, onCompleteTodo, onUpdateTodo}){

const[isEditing, setIsEditing]=useState(false);
const [workingTitle, setWorkingTitle] = useState(todo.title);

const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
};

const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
}

const handleUpdate = (event) => {
    if(!isEditing) return;
    event.preventDefault();
    onUpdateTodo({...todo, title:workingTitle});
    setIsEditing(false);
}

    return (
     <li>
        <form onSubmit={handleUpdate}>
            {isEditing ? (
            <>
                <TextInputWithLabel 
                value={workingTitle}
                // value={todo.title}
                onChange={handleEdit}
                elementId = {`editTodo${todo.id}`}
                labelText="Edit Todo"
                /> 
                <button type="button" onClick={handleCancel}>Cancel</button>
                <button type='button' onClick={handleUpdate}>Update</button>
                </>
            ):(
                <>
                    <label>
                        <input 
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => onCompleteTodo(todo.id)}
                            id={`checkbox${todo.id}`}
                        />
                    </label>
                    <span onClick={() => setIsEditing (true)}>{todo.title}</span>
                </>
            )}
        </form> 
    </li>
    );
}

export default TodoListItem;