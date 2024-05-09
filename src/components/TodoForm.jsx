import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";

const url = "https://68145edbcab20cd3.mokky.dev/todo";

const TodoForm = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [edit, setEdit] = useState(null);

  //! Get Todos

  const getTodos = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  //! Post Todos

  const postTodos = async (e) => {
    e.preventDefault();
    const newData = {
      text: input,
      completed: false, // New todos are not completed by default
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setInput("");
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  //! Delete Todos

  const deleteTodo = async (id) => {
    try {
      await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  //! Patch Todos

  const patchTodos = async (id, updatedData) => {
    try {
      await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      getTodos();
      if (edit === id) setEdit(null); // Reset edit state after successful update
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, text) => {
    setEdit(id);
    setEditInput(text);
  };

  const handleToggleComplete = async (id, completed) => {
    const updatedData = {
      completed: !completed,
    };
    patchTodos(id, updatedData);
  };

  //! UseEffect TOdos

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <div>
        <div>
          <form onSubmit={postTodos}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>
          {todos.map((item) => (
            <StyledContainer key={item.id} completed={item.completed}>
              {edit === item.id ? (
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
              ) : (
                <h1>{item.text}</h1>
              )}
              <button onClick={() => handleToggleComplete(item.id, item.completed)}>
                {item.completed ? " uncomplete" : " Complete"}
              </button>
              {edit === item.id ? (
                <>
                  <button onClick={() => patchTodos(item.id, { text: editInput })}>
                    Save
                  </button>
                  <button onClick={() => handleEdit(null)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => handleEdit(item.id, item.text)}>Edit</button>
              )}
              <button onClick={() => deleteTodo(item.id)}>Delete</button>
            </StyledContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoForm;

const StyledContainer = styled.div`
  background: red;

  ${(props) =>
    props.completed &&
    css`
      text-decoration: line-through;
    `}
`;
